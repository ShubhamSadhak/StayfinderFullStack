const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const normalizePhoneNumber = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

export const mapUser = (user) => {
  if (!user) return null;

  return {
    _id: user._id,
    name: user.name || user.userName || '',
    email: user.email || '',
    phone: user.phone || String(user.phoneNo || ''),
    role: user.role || user.userRole || 'Customer',
    location: user.location
      ? {
          state: user.location.state || '',
          city: user.location.city || '',
          pincode: String(user.location.pincode || ''),
          address: user.location.address || '',
          lat: user.location.lat,
          lng: user.location.lng,
        }
      : undefined,
    isPhoneVerified: Boolean(user.isPhoneVerified ?? user.phoneVerified),
    createdAt: user.createdAt,
  };
};

export const mapReview = (review) => {
  if (!review) return null;

  return {
    _id: review._id,
    pg: review.pg || review.pgId,
    customer: review.customer || review.reviewerId,
    customerName: review.customerName || review.reviewerName || 'Verified Guest',
    rating: Number(review.rating || 0),
    feedback: review.feedback || review.review || '',
    createdAt: review.createdAt,
  };
};

export const mapPG = (pg) => {
  if (!pg) return null;

  const ownerObj = isObject(pg.ownerId) ? pg.ownerId : isObject(pg.owner) ? pg.owner : null;
  const ownerId = ownerObj?._id || pg.ownerId || pg.owner || '';

  return {
    _id: pg._id,
    pgName: pg.pgName || '',
    owner: ownerId,
    ownerName: pg.ownerName || ownerObj?.userName || ownerObj?.name || '',
    ownerPhone: pg.ownerPhone || (ownerObj?.phoneNo ? String(ownerObj.phoneNo) : ownerObj?.phone || ''),
    location: {
      state: pg.location?.state || '',
      city: pg.location?.city || '',
      pincode: String(pg.location?.pincode || ''),
      address: pg.location?.address || '',
      lat: pg.location?.lat,
      lng: pg.location?.lng,
    },
    price: Number(pg.price || 0),
    foodAvailability: Boolean(pg.foodAvailability ?? pg.withFood),
    wifiAvailability: Boolean(pg.wifiAvailability ?? pg.withWifi),
    genderPreference: pg.genderPreference || pg.gender || 'Unisex',
    roomSharingType: pg.roomSharingType || pg.sharedRoom || 'Double',
    availabilityStatus: pg.availabilityStatus || pg.availability || 'Available',
    description: pg.description || '',
    amenities: Array.isArray(pg.amenities) ? pg.amenities : [],
    images: Array.isArray(pg.images) ? pg.images : [],
    ratingAverage: typeof pg.ratingAverage === 'number' ? pg.ratingAverage : undefined,
    totalReviews: typeof pg.totalReviews === 'number' ? pg.totalReviews : undefined,
    createdAt: pg.createdAt,
  };
};

export const mapBooking = (booking) => {
  if (!booking) return null;

  return {
    _id: booking._id,
    pg: isObject(booking.pg) ? mapPG(booking.pg) : booking.pg || booking.pgId,
    pgDetails: booking.pgDetails ? mapPG(booking.pgDetails) : booking.pgId && isObject(booking.pgId) ? mapPG(booking.pgId) : undefined,
    customer: isObject(booking.customer) ? mapUser(booking.customer) : booking.customer || booking.userId,
    customerName: booking.customerName || '',
    customerPhone: booking.customerPhone || '',
    fromDate: booking.fromDate ? new Date(booking.fromDate).toISOString().split('T')[0] : '',
    toDate: booking.toDate
      ? new Date(booking.toDate).toISOString().split('T')[0]
      : booking.todate
      ? new Date(booking.todate).toISOString().split('T')[0]
      : '',
    roomType: booking.roomType || booking.bookingRoomType || 'Double',
    foodPreference: Boolean(booking.foodPreference ?? booking.withFood),
    bookingStatus: booking.bookingStatus || booking.status || 'Pending',
    totalAmount: typeof booking.totalAmount === 'number' ? booking.totalAmount : undefined,
    createdAt: booking.createdAt,
  };
};

export const mapAuthPayload = ({ name, email, phone, password, role, location }) => ({
  userName: name,
  email,
  phoneNo: Number(normalizePhoneNumber(phone)),
  password,
  userRole: role,
  location: {
    state: location?.state || '',
    city: location?.city || '',
    pincode: Number(location?.pincode || 0),
  },
});

export const mapProfilePayload = ({ name, email, phone, location }) => ({
  userName: name,
  email,
  phoneNo: Number(normalizePhoneNumber(phone)),
  location: {
    state: location?.state || '',
    city: location?.city || '',
    pincode: Number(location?.pincode || 0),
  },
});

export const mapPGPayload = (payload) => ({
  pgName: payload.pgName,
  location: {
    state: payload.location?.state || '',
    city: payload.location?.city || '',
    pincode: Number(payload.location?.pincode || 0),
  },
  price: Number(payload.price),
  withFood: Boolean(payload.foodAvailability),
  withWifi: Boolean(payload.wifiAvailability),
  gender: payload.genderPreference,
  sharedRoom: payload.roomSharingType,
  availability: payload.availabilityStatus,
});

export const mapBookingPayload = ({ pgId, fromDate, toDate, roomType, foodPreference }) => ({
  pgId,
  fromDate,
  todate: toDate,
  bookingRoomType: roomType,
  withFood: Boolean(foodPreference),
});

export const mapCreateReviewPayload = ({ pgId, rating, feedback }) => ({
  pgId,
  rating,
  review: feedback,
});

export const mapUpdateReviewPayload = ({ reviewId, rating, feedback }) => ({
  reviewId,
  rating,
  review: feedback,
});

export { normalizePhoneNumber };
