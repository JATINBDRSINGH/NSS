import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from "appwrite"

// Fallback admin email and additional admin check methods
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['ram@gmail.co' , 'jatinbikramsingh@gmail.com']
const ADMIN_DOMAINS = process.env.ADMIN_DOMAINS?.split(',') || ['vercel.com']

// Initialize the Appwrite client
const client = new Client()


// Set up the client with your Appwrite endpoint and project ID
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "67e10ade002631823756")

// Export the client and services
// 
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Database and collection IDs from environment variables
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const CLUBS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CLUBS_COLLECTION_ID || ""
const APPLICATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || ""
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || ""
const EVENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || ""

// Comprehensive Admin Check Function
export async function isUserAdmin() {
  try {

    const user = await getCurrentUser()
     console.log("Current User:", user)
    if (!user) return false


    // Method 1: Check against predefined admin emails
    if (ADMIN_EMAILS.includes(user.email)) return true

    // Method 2: Check against admin domains
    const userDomain = user.email.split('@')[1]
    if (ADMIN_DOMAINS.includes(userDomain)) return true

    // Method 3: Check Appwrite built-in permissions
    try {
      const userAccount = await account.get()
      
      // Check if user has admin-related permissions
      const isAdminByPermissions = userAccount.$permissions?.some(permission => 
        permission.includes('admin') || 
        permission.includes('owner') ||
        permission.includes('write') // Add more granular checks as needed
      )

      if (isAdminByPermissions) return true
    } catch (permissionError) {
      console.warn("Error checking Appwrite permissions:", permissionError)
    }

    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// User Authentication Functions
export async function createAccount(email: string, password: string, name: string) {
  try {
    // Create a new account
    const newAccount = await account.create(ID.unique(), email, password, name)

    // Log in the user after account creation
    if (newAccount) {
      return await login(email, password)
    }

    return newAccount
  } catch (error) {
    console.error("Error creating account:", error)
    throw error
  }
}

export async function login(email: string, password: string) {
  try {
    return await account.createEmailPasswordSession(email, password)
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}


export async function logout() {
  try {
    return await account.deleteSession("current")
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get() 
    /* username : "username" , email : "", password :'"} */
    return currentAccount
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Optional: Method to set admin status via Appwrite's role/permission system
// export async function setAdminRole(userId: string, makeAdmin: boolean = true) {
//   try {
//     // This method requires you to have appropriate permissions in Appwrite
//     if (makeAdmin) {
//       // Add admin role/permission to the user
//       // Note: The exact implementation depends on your Appwrite setup
//       // You might need to use Appwrite's team or custom claims feature
//       return await account.updateStatus(userId, 'active', ['admin'])
//     } else {
//       // Remove admin role/permission
//       return await account.updateStatus(userId, 'active', [])
//     }
//   } catch (error) {
//     console.error("Error setting admin role:", error)
//     throw error
//   }
//}

// Club Application Functions
export async function submitClubApplication(applicationData: any, profileImage: File) {
  try {
    // First upload the profile image
    const uploadedFile = await uploadFile(profileImage)

    // Create the application document
    return await databases.createDocument(
      DATABASE_ID, 
      APPLICATIONS_COLLECTION_ID, 
      ID.unique(), 
      {
        ...applicationData,
        profileImageId: uploadedFile.$id,
        status: "pending",
        submissionDate: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error("Error submitting application:", error)
    throw error
  }
}

export async function getApplications(status = "all") {
  try {
    const isAdmin = await isUserAdmin()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")
    
    const queries = isAdmin 
      ? (status !== "all" ? [Query.equal("status", status)] : [])
      : [
          Query.equal("userId", user.$id),
          ...(status !== "all" ? [Query.equal("status", status)] : [])
        ]

    return await databases.listDocuments(DATABASE_ID, APPLICATIONS_COLLECTION_ID, queries)
  } catch (error) {
    console.error("Error getting applications:", error)
    throw error
  }
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can update application status")
    
    return await databases.updateDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, applicationId, { 
      status,
      reviewedAt: new Date().toISOString() 
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    throw error
  }
}

// Club Management Functions
export async function createClub(clubData: any, clubImage: File) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can create clubs")
    
    // First upload the club image
    const uploadedFile = await uploadFile(clubImage)
    
    const user = await getCurrentUser()
    
    // Create the club document
    return await databases.createDocument(
      DATABASE_ID, 
      CLUBS_COLLECTION_ID, 
      ID.unique(), 
      {
        ...clubData,
        imageId: uploadedFile.$id,
        createdBy: user?.$id,
        createdAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error("Error creating club:", error)
    throw error
  }
}

export async function getClubs() {
  try {
     
    return await databases.listDocuments(DATABASE_ID, CLUBS_COLLECTION_ID)

  } catch (error) {
    console.error("Error getting clubs:", error)
    throw error
  }
}

export async function updateClub(clubId: string, clubData: any, clubImage?: File) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can update clubs")
    
    const data = { ...clubData, updatedAt: new Date().toISOString() }

    // If a new image is provided, upload it
    if (clubImage) {
      const uploadedFile = await uploadFile(clubImage)
      data.imageId = uploadedFile.$id
    }

    return await databases.updateDocument(DATABASE_ID, CLUBS_COLLECTION_ID, clubId, data)
  } catch (error) {
    console.error("Error updating club:", error)
    throw error
  }
}

export async function deleteClub(clubId: string) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can delete clubs")
    
    // Optionally, get the club first to delete its image as well
    const club = await databases.getDocument(DATABASE_ID, CLUBS_COLLECTION_ID, clubId)
    if (club && club.imageId) {
      try {
        await storage.deleteFile(STORAGE_BUCKET_ID, club.imageId)
      } catch (err) {
        console.warn("Error deleting club image:", err)
      }
    }
    
    return await databases.deleteDocument(DATABASE_ID, CLUBS_COLLECTION_ID, clubId)
  } catch (error) {
    console.error("Error deleting club:", error)
    throw error
  }
}

// Event Management Functions
export async function createEvent(eventData: any, eventImage: File) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can create events")
    
    // First upload the event image
    const uploadedFile = await uploadFile(eventImage)
    
    const user = await getCurrentUser()

    // Create the event document
    return await databases.createDocument(
      DATABASE_ID, 
      EVENTS_COLLECTION_ID, 
      ID.unique(), 
      {
        ...eventData,
        imageId: uploadedFile.$id,
        createdBy: user?.$id,
        createdAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export async function getEvents(filter = "all") {
  try {
    const queries = []

    if (filter === "upcoming") {
      queries.push(Query.greaterThan("date", new Date().toISOString()))
      queries.push(Query.orderAsc("date"))
    } else if (filter === "past") {
      queries.push(Query.lessThan("date", new Date().toISOString()))
      queries.push(Query.orderDesc("date"))
    } else {
      // For 'all', sort with upcoming events first, then past events
      queries.push(Query.orderAsc("date"))
    }

    return await databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, queries)
  } catch (error) {
    console.error("Error getting events:", error)
    throw error
  }
}

export async function getEvent(eventId: string) {
  try {
    return await databases.getDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId)
  } catch (error) {
    console.error("Error getting event:", error)
    throw error
  }
}

export async function updateEvent(eventId: string, eventData: any, eventImage?: File) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can update events")
    
    const data = { ...eventData, updatedAt: new Date().toISOString() }

    // If a new image is provided, upload it
    if (eventImage) {
      const uploadedFile = await uploadFile(eventImage)
      data.imageId = uploadedFile.$id
    }

    return await databases.updateDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId, data)
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) throw new Error("Only admins can delete events")
    
    // Optionally, get the event first to delete its image as well
    const event = await databases.getDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId)
    if (event && event.imageId) {
      try {
        await storage.deleteFile(STORAGE_BUCKET_ID, event.imageId)
      } catch (err) {
        console.warn("Error deleting event image:", err)
      }
    }
    
    return await databases.deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

// File Upload Functions
export async function uploadFile(file: File) {
  try {
    // Check if the file is valid 
    if (!file || file.size === 0) throw new Error("Invalid file")
    
    return await storage.createFile(
      STORAGE_BUCKET_ID, 
      ID.unique(), 
      file
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export function getFilePreview(fileId: string) {
  try {
    return storage.getFilePreview(
      STORAGE_BUCKET_ID,
      fileId,
      2000, // width
      2000, // height,
      "center", // gravity
      100, // quality
    )
  } catch (error) {
    console.error("Error getting file preview:", error)
    return null
  }
}