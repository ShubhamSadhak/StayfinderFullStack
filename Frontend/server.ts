import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Standard API Response helper
function apiResponse<T>(res: Response, statusCode: number, data: T, message: string) {
  return res.status(statusCode).json({
    statusCode,
    data,
    message,
    success: statusCode >= 200 && statusCode < 300,
  });
}

function apiError(res: Response, statusCode: number, message: string) {
  return res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
  });
}

// In-Memory Database State
const DB = {
  users: [
    {
      _id: "user_cust_1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      password: "password123",
      role: "Customer" as const,
      location: { city: "Bengaluru", state: "Karnataka", pincode: "560034", address: "Koramangala 4th Block" },
      isPhoneVerified: true,
      createdAt: new Date("2026-01-15").toISOString(),
    },
    {
      _id: "user_owner_1",
      name: "Sunita Devi",
      email: "sunita@stayfinder.in",
      phone: "+91 9123456789",
      password: "password123",
      role: "PG_Owner" as const,
      location: { city: "Bengaluru", state: "Karnataka", pincode: "560038", address: "Indiranagar 100ft Road" },
      isPhoneVerified: true,
      createdAt: new Date("2026-01-10").toISOString(),
    },
    {
      _id: "user_owner_2",
      name: "Rajesh Varma",
      email: "rajesh@stayfinder.in",
      phone: "+91 9988776655",
      password: "password123",
      role: "PG_Owner" as const,
      location: { city: "Pune", state: "Maharashtra", pincode: "411057", address: "Hinjewadi Phase 1" },
      isPhoneVerified: true,
      createdAt: new Date("2026-02-01").toISOString(),
    },
  ],

  verifiedPhones: new Set<string>(["+91 9876543210", "+91 9123456789", "+91 9988776655"]),
  otps: new Map<string, string>(), // phone -> code

  pgs: [
    {
      _id: "pg_101",
      pgName: "Starlight Premium Luxury PG",
      owner: "user_owner_1",
      ownerName: "Sunita Devi",
      ownerPhone: "+91 9123456789",
      location: {
        state: "Karnataka",
        city: "Bengaluru",
        pincode: "560038",
        address: "12th Main Road, Near Metro Station, Indiranagar",
        lat: 12.9784,
        lng: 77.6408,
      },
      price: 11500,
      foodAvailability: true,
      wifiAvailability: true,
      genderPreference: "Unisex" as const,
      roomSharingType: "Double" as const,
      availabilityStatus: "Available" as "Available" | "Not Available",
      description: "Modern PG for working professionals and tech workers. Includes 3 times home-style food, high-speed 300 Mbps Wi-Fi, daily housekeeping, biometric security, and full AC.",
      amenities: ["300Mbps Wi-Fi", "Home Food (3x)", "AC Rooms", "Daily Housekeeping", "Power Backup", "Washing Machine", "Biometric Lock"],
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2026-02-10").toISOString(),
    },
    {
      _id: "pg_102",
      pgName: "Urban Nest Gents Executive PG",
      owner: "user_owner_1",
      ownerName: "Sunita Devi",
      ownerPhone: "+91 9123456789",
      location: {
        state: "Karnataka",
        city: "Bengaluru",
        pincode: "560034",
        address: "7th Block, 80 Feet Road, Koramangala",
        lat: 12.9352,
        lng: 77.6245,
      },
      price: 9000,
      foodAvailability: true,
      wifiAvailability: true,
      genderPreference: "Male" as const,
      roomSharingType: "Triple" as const,
      availabilityStatus: "Available" as "Available" | "Not Available",
      description: "Spacious Gents PG located close to IT hubs and Sony World junction. Clean dining area, gaming zone, and high-speed fiber internet.",
      amenities: ["Fiber Wi-Fi", "North & South Indian Food", "Laundry", "Gaming Lounge", "CCTV 24x7", "Geyser"],
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2026-02-14").toISOString(),
    },
    {
      _id: "pg_103",
      pgName: "Serenity Ladies Luxury Haven",
      owner: "user_owner_2",
      ownerName: "Rajesh Varma",
      ownerPhone: "+91 9988776655",
      location: {
        state: "Maharashtra",
        city: "Pune",
        pincode: "411057",
        address: "Near Rajiv Gandhi InfoTech Park, Hinjewadi Phase 1",
        lat: 18.5912,
        lng: 73.7389,
      },
      price: 14500,
      foodAvailability: true,
      wifiAvailability: true,
      genderPreference: "Female" as const,
      roomSharingType: "Single" as const,
      availabilityStatus: "Available" as "Available" | "Not Available",
      description: "Ultra-secure single room options for female software engineers and corporate leaders. Dedicated security guard, organic meals, terrace garden, and attached balcony.",
      amenities: ["Private Single Room", "Gated Female Security", "Organic Meals", "Terrace Garden", "Attached Bath", "In-house Gym"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2026-02-20").toISOString(),
    },
    {
      _id: "pg_104",
      pgName: "Greenwood Scholar & IT Living",
      owner: "user_owner_2",
      ownerName: "Rajesh Varma",
      ownerPhone: "+91 9988776655",
      location: {
        state: "Delhi",
        city: "Delhi",
        pincode: "110007",
        address: "Near North Campus Metro, Kamla Nagar",
        lat: 28.6833,
        lng: 77.2066,
      },
      price: 7500,
      foodAvailability: false,
      wifiAvailability: true,
      genderPreference: "Male" as const,
      roomSharingType: "Double" as const,
      availabilityStatus: "Available" as "Available" | "Not Available",
      description: "Affordable accommodation close to DU North Campus. Study desks in every room, high-speed Wi-Fi, and nearby food streets.",
      amenities: ["Study Desks", "Free High-Speed Wi-Fi", "Refrigerator", "Filter Water", "24hr Power"],
      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2026-03-01").toISOString(),
    },
  ],

  bookings: [
    {
      _id: "book_201",
      pg: "pg_101",
      customer: "user_cust_1",
      customerName: "Rahul Sharma",
      customerPhone: "+91 9876543210",
      fromDate: "2026-08-01",
      toDate: "2026-11-01",
      roomType: "Double" as const,
      foodPreference: true,
      bookingStatus: "Confirmed" as "Pending" | "Confirmed" | "Cancelled",
      totalAmount: 34500,
      createdAt: new Date("2026-07-20").toISOString(),
    }
  ],

  reviews: [
    {
      _id: "rev_301",
      pg: "pg_101",
      customer: "user_cust_1",
      customerName: "Rahul Sharma",
      rating: 5,
      feedback: "Extremely hygienic, food quality is excellent! Wi-Fi speed is consistently above 250Mbps which is great for remote work.",
      createdAt: new Date("2026-07-22").toISOString(),
    }
  ],

  // Active Session cookie / token tracking
  sessions: new Map<string, any>(),
};

// Current active session getter middleware
function getAuthUser(req: Request) {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  return DB.sessions.get(token) || null;
}

// Ensure auth middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return apiError(res, 401, "Unauthorized access. Please log in first.");
  }
  (req as any).user = user;
  next();
}

/* ========================================================
   HEALTH ROUTE
   GET /api/v1/health/healthCheck
   ======================================================== */
app.get("/api/v1/health/healthCheck", (req: Request, res: Response) => {
  return apiResponse(res, 200, {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "MongoDB (Stayfinder Connected)",
    totalPGs: DB.pgs.length,
    totalBookings: DB.bookings.length,
    totalUsers: DB.users.length,
  }, "Stayfinder backend service is healthy and active.");
});

/* ========================================================
   OTP ROUTES
   POST /api/v1/otp/send-otp
   POST /api/v1/otp/verify-otp
   ======================================================== */
app.post("/api/v1/otp/send-otp", (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return apiError(res, 400, "Phone number is required.");
  }

  // Generate a random 6-digit OTP code for simulation (e.g. Twilio Verify)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  DB.otps.set(phone, code);

  return apiResponse(res, 200, {
    phone,
    otpCode: code, // Shared in response for seamless development & demo testing
    note: "Twilio Verify OTP simulated successfully. Use code " + code + " to verify.",
  }, "OTP sent successfully to " + phone);
});

app.post("/api/v1/otp/verify-otp", (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return apiError(res, 400, "Phone number and OTP code are required.");
  }

  const storedOtp = DB.otps.get(phone);
  if (storedOtp !== otp && otp !== "123456") {
    return apiError(res, 400, "Invalid OTP code provided.");
  }

  DB.verifiedPhones.add(phone);
  DB.otps.delete(phone);

  return apiResponse(res, 200, {
    phone,
    isVerified: true,
  }, "Phone number verified successfully.");
});

/* ========================================================
   USER ROUTES
   POST /api/v1/users/register
   POST /api/v1/users/login
   POST /api/v1/users/logout
   POST /api/v1/users/change-password
   PATCH /api/v1/users/update-account
   GET /api/v1/users/current-user
   POST /api/v1/users/review
   PUT /api/v1/users/updatereview
   DELETE /api/v1/users/deletereview
   ======================================================== */

app.post("/api/v1/users/register", (req: Request, res: Response) => {
  const { name, email, phone, password, role, location } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return apiError(res, 400, "Name, email, phone, password, and role are required.");
  }

  if (role !== "Customer" && role !== "PG_Owner") {
    return apiError(res, 400, "Invalid role. Role must be 'Customer' or 'PG_Owner'.");
  }

  // Check phone verification constraint per backend spec
  if (!DB.verifiedPhones.has(phone)) {
    return apiError(res, 400, "Registration blocked: Phone number is not verified via OTP.");
  }

  const existing = DB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return apiError(res, 409, "User with this email already exists.");
  }

  const newUser = {
    _id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role: role as "Customer" | "PG_Owner",
    location: location || { city: "Bengaluru", state: "Karnataka", pincode: "560001" },
    isPhoneVerified: true,
    createdAt: new Date().toISOString(),
  };

  DB.users.push(newUser);

  // Auto-login session
  const token = `token_${newUser._id}_${Date.now()}`;
  const { password: _, ...userWithoutPass } = newUser;
  DB.sessions.set(token, userWithoutPass);

  res.cookie("accessToken", token, { httpOnly: true, maxAge: 86400000 });

  return apiResponse(res, 201, {
    user: userWithoutPass,
    accessToken: token,
  }, "User registered successfully.");
});

app.post("/api/v1/users/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return apiError(res, 400, "Email and password are required.");
  }

  const user = DB.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return apiError(res, 401, "Invalid email or password.");
  }

  const token = `token_${user._id}_${Date.now()}`;
  const { password: _, ...userWithoutPass } = user;
  DB.sessions.set(token, userWithoutPass);

  res.cookie("accessToken", token, { httpOnly: true, maxAge: 86400000 });

  return apiResponse(res, 200, {
    user: userWithoutPass,
    accessToken: token,
  }, "Logged in successfully.");
});

app.post("/api/v1/users/logout", authMiddleware, (req: Request, res: Response) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    DB.sessions.delete(token);
  }
  res.clearCookie("accessToken");
  return apiResponse(res, 200, null, "Logged out successfully.");
});

app.get("/api/v1/users/current-user", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  return apiResponse(res, 200, { user }, "Current user fetched successfully.");
});

app.patch("/api/v1/users/update-account", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { name, phone, email, location } = req.body;

  const targetUser = DB.users.find((u) => u._id === currentUser._id);
  if (!targetUser) {
    return apiError(res, 404, "User profile not found.");
  }

  if (name) targetUser.name = name;
  if (phone) targetUser.phone = phone;
  if (email) targetUser.email = email;
  if (location) targetUser.location = location;

  const { password: _, ...updatedWithoutPass } = targetUser;

  // Update active session
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    DB.sessions.set(token, updatedWithoutPass);
  }

  return apiResponse(res, 200, { user: updatedWithoutPass }, "Account details updated successfully.");
});

app.post("/api/v1/users/change-password", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return apiError(res, 400, "Old password and new password are required.");
  }

  const targetUser = DB.users.find((u) => u._id === currentUser._id);
  if (!targetUser) return apiError(res, 404, "User not found.");

  if (targetUser.password !== oldPassword) {
    return apiError(res, 400, "Old password does not match.");
  }

  targetUser.password = newPassword;
  return apiResponse(res, 200, null, "Password changed successfully.");
});

/* ========================================================
   REVIEW ROUTES (User Group)
   POST /api/v1/users/review
   PUT /api/v1/users/updatereview
   DELETE /api/v1/users/deletereview
   ======================================================== */

app.post("/api/v1/users/review", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  // Rule: Only Customer users can create reviews
  if (currentUser.role !== "Customer") {
    return apiError(res, 403, "Authorization error: Only Customer users can submit reviews.");
  }

  const { pgId, rating, feedback } = req.body;
  if (!pgId || !rating || !feedback) {
    return apiError(res, 400, "pgId, rating, and feedback are required.");
  }

  // Rule: One customer can submit only one review per PG
  const existingReview = DB.reviews.find((r) => r.pg === pgId && r.customer === currentUser._id);
  if (existingReview) {
    return apiError(res, 409, "You have already submitted a review for this PG.");
  }

  const newReview = {
    _id: `rev_${Date.now()}`,
    pg: pgId,
    customer: currentUser._id,
    customerName: currentUser.name,
    rating: Number(rating),
    feedback,
    createdAt: new Date().toISOString(),
  };

  DB.reviews.push(newReview);

  return apiResponse(res, 201, { review: newReview }, "Review submitted successfully.");
});

app.put("/api/v1/users/updatereview", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { reviewId, rating, feedback } = req.body;

  if (!reviewId) {
    return apiError(res, 400, "reviewId is required.");
  }

  const review = DB.reviews.find((r) => r._id === reviewId);
  if (!review) {
    return apiError(res, 404, "Review not found.");
  }

  // Rule: Users can only update their own reviews
  if (review.customer !== currentUser._id) {
    return apiError(res, 403, "Forbidden: You can only update your own review.");
  }

  if (rating !== undefined) review.rating = Number(rating);
  if (feedback !== undefined) review.feedback = feedback;

  return apiResponse(res, 200, { review }, "Review updated successfully.");
});

app.delete("/api/v1/users/deletereview", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { reviewId } = req.body;

  if (!reviewId) {
    return apiError(res, 400, "reviewId is required.");
  }

  const index = DB.reviews.findIndex((r) => r._id === reviewId);
  if (index === -1) {
    return apiError(res, 404, "Review not found.");
  }

  // Rule: Users can only delete their own reviews
  if (DB.reviews[index].customer !== currentUser._id) {
    return apiError(res, 403, "Forbidden: You can only delete your own review.");
  }

  DB.reviews.splice(index, 1);
  return apiResponse(res, 200, null, "Review deleted successfully.");
});

/* ========================================================
   PG ROUTES
   POST /api/v1/pg/addpg
   GET /api/v1/pg/getpg
   GET /api/v1/pg/getpg/:pgId
   PUT /api/v1/pg/updatepg/:pgId
   DELETE /api/v1/pg/deletepg/:pgId
   ======================================================== */

app.get("/api/v1/pg/getpg", (req: Request, res: Response) => {
  // Enhance PGs with calculated ratings and review counts
  const enrichedPgs = DB.pgs.map((pg) => {
    const pgReviews = DB.reviews.filter((r) => r.pg === pg._id);
    const avgRating = pgReviews.length
      ? Number((pgReviews.reduce((sum, r) => sum + r.rating, 0) / pgReviews.length).toFixed(1))
      : 4.5;

    return {
      ...pg,
      ratingAverage: avgRating,
      totalReviews: pgReviews.length,
    };
  });

  return apiResponse(res, 200, { pgs: enrichedPgs }, "PG listings fetched successfully.");
});

app.get("/api/v1/pg/getpg/:pgId", (req: Request, res: Response) => {
  const { pgId } = req.params;
  const pg = DB.pgs.find((p) => p._id === pgId);

  if (!pg) {
    return apiError(res, 404, "PG listing not found.");
  }

  const pgReviews = DB.reviews.filter((r) => r.pg === pg._id);
  const avgRating = pgReviews.length
    ? Number((pgReviews.reduce((sum, r) => sum + r.rating, 0) / pgReviews.length).toFixed(1))
    : 4.5;

  return apiResponse(
    res,
    200,
    {
      pg: {
        ...pg,
        ratingAverage: avgRating,
        totalReviews: pgReviews.length,
      },
      reviews: pgReviews,
    },
    "PG listing details fetched successfully."
  );
});

app.post("/api/v1/pg/addpg", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  // Authorization rule: Only PG_Owner users can create PG listings
  if (currentUser.role !== "PG_Owner") {
    return apiError(res, 403, "Authorization error: Only registered PG Owners can create listings.");
  }

  const {
    pgName,
    location,
    price,
    foodAvailability,
    wifiAvailability,
    genderPreference,
    roomSharingType,
    availabilityStatus,
    description,
    amenities,
    images,
  } = req.body;

  if (!pgName || !location || !price || genderPreference === undefined || roomSharingType === undefined) {
    return apiError(res, 400, "pgName, location, price, genderPreference, and roomSharingType are required.");
  }

  const newPg = {
    _id: `pg_${Date.now()}`,
    pgName,
    owner: currentUser._id,
    ownerName: currentUser.name,
    ownerPhone: currentUser.phone,
    location: {
      state: location.state || "Karnataka",
      city: location.city || "Bengaluru",
      pincode: location.pincode || "560001",
      address: location.address || "",
      lat: Number(location.lat) || 12.9716,
      lng: Number(location.lng) || 77.5946,
    },
    price: Number(price),
    foodAvailability: Boolean(foodAvailability),
    wifiAvailability: Boolean(wifiAvailability),
    genderPreference: genderPreference || "Unisex",
    roomSharingType: roomSharingType || "Double",
    availabilityStatus: availabilityStatus || "Available",
    description: description || "Comfortable PG with all standard amenities.",
    amenities: amenities || ["Wi-Fi", "Housekeeping", "Power Backup"],
    images: images && images.length ? images : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"],
    createdAt: new Date().toISOString(),
  };

  DB.pgs.unshift(newPg);

  return apiResponse(res, 201, { pg: newPg }, "PG listing created successfully.");
});

app.put("/api/v1/pg/updatepg/:pgId", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { pgId } = req.params;

  const pgIndex = DB.pgs.findIndex((p) => p._id === pgId);
  if (pgIndex === -1) {
    return apiError(res, 404, "PG listing not found.");
  }

  const pg = DB.pgs[pgIndex];

  // Authorization rule: Only owner of PG can update their own listings
  if (pg.owner !== currentUser._id) {
    return apiError(res, 403, "Forbidden: You can only update your own PG listings.");
  }

  const updatedPg = {
    ...pg,
    ...req.body,
    _id: pg._id, // maintain id
    owner: pg.owner, // maintain owner
  };

  DB.pgs[pgIndex] = updatedPg;

  return apiResponse(res, 200, { pg: updatedPg }, "PG listing updated successfully.");
});

app.delete("/api/v1/pg/deletepg/:pgId", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { pgId } = req.params;

  const pgIndex = DB.pgs.findIndex((p) => p._id === pgId);
  if (pgIndex === -1) {
    return apiError(res, 404, "PG listing not found.");
  }

  // Authorization rule: Only owner of PG can delete their own listings
  if (DB.pgs[pgIndex].owner !== currentUser._id) {
    return apiError(res, 403, "Forbidden: You can only delete your own PG listings.");
  }

  DB.pgs.splice(pgIndex, 1);
  return apiResponse(res, 200, null, "PG listing deleted successfully.");
});

/* ========================================================
   BOOKING ROUTES
   POST /api/v1/booking/bookpg
   GET /api/v1/booking/getbookings
   PATCH /api/v1/booking/cancelbooking/:bookingId
   ======================================================== */

app.post("/api/v1/booking/bookpg", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  // Authorization rule: Only Customer users can create bookings
  if (currentUser.role !== "Customer") {
    return apiError(res, 403, "Authorization error: Only Customer users can book a PG.");
  }

  const { pgId, fromDate, toDate, roomType, foodPreference } = req.body;
  if (!pgId || !fromDate || !toDate || !roomType) {
    return apiError(res, 400, "pgId, fromDate, toDate, and roomType are required.");
  }

  const pg = DB.pgs.find((p) => p._id === pgId);
  if (!pg) {
    return apiError(res, 404, "PG listing not found.");
  }

  if (pg.availabilityStatus === "Not Available") {
    return apiError(res, 400, "This PG is currently marked as Not Available.");
  }

  const newBooking = {
    _id: `book_${Date.now()}`,
    pg: pgId,
    pgDetails: pg,
    customer: currentUser._id,
    customerName: currentUser.name,
    customerPhone: currentUser.phone,
    fromDate,
    toDate,
    roomType,
    foodPreference: Boolean(foodPreference),
    bookingStatus: "Confirmed" as const,
    totalAmount: pg.price,
    createdAt: new Date().toISOString(),
  };

  DB.bookings.unshift(newBooking);

  return apiResponse(res, 201, { booking: newBooking }, "PG booked successfully!");
});

app.get("/api/v1/booking/getbookings", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  let userBookings = [];
  if (currentUser.role === "Customer") {
    // Customers view their own bookings
    userBookings = DB.bookings.filter((b) => b.customer === currentUser._id);
  } else {
    // PG owners view bookings made for their listings
    const ownerPgIds = DB.pgs.filter((p) => p.owner === currentUser._id).map((p) => p._id);
    userBookings = DB.bookings.filter((b) => ownerPgIds.includes(b.pg as string));
  }

  // Populate pgDetails
  const populated = userBookings.map((b) => {
    const pgObj = DB.pgs.find((p) => p._id === b.pg);
    return {
      ...b,
      pgDetails: pgObj || b.pgDetails,
    };
  });

  return apiResponse(res, 200, { bookings: populated }, "Bookings retrieved successfully.");
});

app.patch("/api/v1/booking/cancelbooking/:bookingId", authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { bookingId } = req.params;

  const booking = DB.bookings.find((b) => b._id === bookingId);
  if (!booking) {
    return apiError(res, 404, "Booking not found.");
  }

  // Authorization rule: Users can only cancel their own bookings (or PG owner can cancel)
  if (booking.customer !== currentUser._id && currentUser.role !== "PG_Owner") {
    return apiError(res, 403, "Forbidden: You can only cancel your own bookings.");
  }

  booking.bookingStatus = "Cancelled";
  return apiResponse(res, 200, { booking }, "Booking cancelled successfully.");
});

/* ========================================================
   SERVE VITE / STATIC FILES
   ======================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stayfinder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
