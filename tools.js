require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");


const getRoomListSchema = yupToJsonSchema(
  yup.object({
    token: yup.string().label("token").required("Token is required"),
    hr_id: yup.string().label("hr_id").required("HR ID is required"),
  })
);

const GET_ROOM_LIST = {
  name: "getRoomList",
  description: "Retrieves all rooms and rates of the property",
  category: "Hotel Management",
  subcategory: "Room Operations",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/rooms?token=${token}&hr_id=${hr_id}`;
      const response = await axios.get(url, {
        headers: {
          "cache-control": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      return "Error fetching room list: " + error;
    }
  },
};

const UPDATE_ROOM = {
  name: "updateRoom",
  description: "Updates room details such as availability, price, and restrictions",
  category: "Hotel Management",
  subcategory: "Room Operations",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
      inv_code: yup.string().label("inv_code").required("Inventory code is required"),
      channel_codes: yup.array().label("channel_codes").default([]),
      start_date: yup.string().label("start_date").required("Start date is required"),
      end_date: yup.string().label("end_date").required("End date is required"),
      availability: yup.number().label("availability").default(null),
      price: yup.number().label("price").default(null),
      min_stay: yup.number().label("min_stay").default(null),
      stop_sale: yup.number().label("stop_sale").default(null),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID, inv_code, channel_codes, start_date, end_date, availability, price, min_stay, stop_sale }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/rooms/`;
      const data = {
        hr_id,
        token,
        inv_code,
        channel_codes,
        start_date,
        end_date,
        availability,
        price,
        min_stay,
        stop_sale,
      };

      const response = await axios.put(url, data, {
        headers: {
          "cache-control": "no-cache",
        },
      });

      return response.data;
    } catch (error) {
      return "Error updating room: " + error;
    }
  },
};

const GET_TRANSACTION_DETAILS = {
  name: "getTransactionDetails",
  description: "Retrieves update status logs of a given transaction ID",
  category: "Hotel Management",
  subcategory: "Transaction Details",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
      transaction_id: yup.string().label("transaction_id").required("Transaction ID is required"),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ transaction_id }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/infos/transaction_details?transaction_id=${transaction_id}&token=${process.env.TOKEN}&hr_id=${process.env.HRID}`;
      const response = await axios.get(url, {
        headers: {
          "cache-control": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      return "Error fetching transaction details: " + error;
    }
  },
};

const RETRIEVE_RESERVATIONS = {
  name: "retrieveReservations",
  description: "Retrieves reservations via pagination",
  category: "Hotel Management",
  subcategory: "Reservation Management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
      from_date: yup.string().label("from_date").default(null),
      from_last_update_date: yup.string().label("from_last_update_date").default(null),
      per_page: yup.number().label("per_page").default(10),
      page: yup.number().label("page").default(1),
      reservation_number: yup.string().label("reservation_number").default(null),
      undelivered: yup.boolean().label("undelivered").default(true),
      modified: yup.boolean().label("modified").default(false),
      booked: yup.boolean().label("booked").default(false),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID, from_date, from_last_update_date, per_page, page, reservation_number, undelivered, modified, booked }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/reservations?token=${token}&hr_id=${hr_id}`;
      const params = {
        from_date,
        from_last_update_date,
        per_page,
        page,
        reservation_number,
        undelivered,
        modified,
        booked,
      };

      const response = await axios.get(url, {
        params,
        headers: {
          "cache-control": "no-cache",
        },
      });

      return response.data;
    } catch (error) {
      return "Error retrieving reservations: " + error;
    }
  },
};

const RESERVATION_STATE_UPDATE = {
  name: "reservationStateUpdate",
  description: "Updates the state of a reservation to 'confirmed' or 'canceled'",
  category: "Hotel Management",
  subcategory: "Reservation Management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
      hr_number: yup.string().label("hr_number").required("Reservation code is required"),
      event: yup.string().label("event").required("Event is required"),
      cancel_reason: yup.string().label("cancel_reason").default(null),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID, hr_number, event, cancel_reason }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/reservations/fire?token=${token}&hr_id=${hr_id}&hr_number=${hr_number}&event=${event}&cancel_reason=${cancel_reason}`;

      const response = await axios.put(url, null, {
        headers: {
          "cache-control": "no-cache",
        },
      });

      return response.data;
    } catch (error) {
      return "Error updating reservation state: " + error;
    }
  },
};

const CONFIRM_RESERVATION_DELIVERY = {
  name: "confirmReservationDelivery",
  description: "Confirms the delivery of a reservation, modification, or cancellation",
  category: "Hotel Management",
  subcategory: "Reservation Management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
      message_uid: yup.string().label("message_uid").required("Message UID is required"),
      pms_number: yup.string().label("pms_number").default(null),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID, message_uid, pms_number }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/reservations/~?token=${token}&hr_id=${hr_id}&message_uid=${message_uid}&pms_number=${pms_number}`;

      const response = await axios.put(url, null, {
        headers: {
          "cache-control": "no-cache",
        },
      });

      return response.data;
    } catch (error) {
      return "Error confirming reservation delivery: " + error;
    }
  },
};

const GET_CHANNEL_LIST = {
  name: "getChannelList",
  description: "Retrieves all available channels of HotelRunner",
  category: "Hotel Management",
  subcategory: "Channel Management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/infos/channels?token=${token}&hr_id=${hr_id}`;
      const response = await axios.get(url, {
        headers: {
          "cache-control": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      return "Error fetching channel list: " + error;
    }
  },
};

const GET_CONNECTED_CHANNEL_LIST = {
  name: "getConnectedChannelList",
  description: "Retrieves all connected channels of a property with process stats",
  category: "Hotel Management",
  subcategory: "Channel Management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: yupToJsonSchema(
    yup.object({
      token: yup.string().label("token").default(process.env.TOKEN).required("Token is required"),
      hr_id: yup.string().label("hr_id").default(process.env.HRID).required("HR ID is required"),
    })
  ),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ token = process.env.TOKEN, hr_id = process.env.HRID }) => {
    try {
      const url = `https://app.hotelrunner.com/api/v2/apps/infos/connected_channels?token=${token}&hr_id=${hr_id}`;
      const response = await axios.get(url, {
        headers: {
          "cache-control": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      return "Error fetching connected channel list: " + error;
    }
  },
};

const tools = [
  GET_ROOM_LIST,
  UPDATE_ROOM,
  GET_TRANSACTION_DETAILS,
  RETRIEVE_RESERVATIONS,
  RESERVATION_STATE_UPDATE,
  CONFIRM_RESERVATION_DELIVERY,
  GET_CHANNEL_LIST,
  GET_CONNECTED_CHANNEL_LIST,
];
module.exports = tools;
