import { json } from "express";
import Connection from "../models/connectio.model.js";
import User from "../models/user.model.js";
import { io, userShocketMap } from "../index.js";
export const sendConnection = async (req, res) => {
  try {
    let { id } = req.params;
    let sender = req.userId;

    let user = await User.findById(sender);
    if (sender == id) {
      return res
        .status(400)
        .json({ message: "You cannot send connection to yourself" });
    }
    if (user.connection.includes(id)) {
      return res.status(400).json({
        message: "You have already sent connection request to this user",
      });
    }
    let existingConnection = await Connection.findOne({
      sender,
      reciver: id,
      status: "pending",
    });
    if (existingConnection) {
      return res.status(400).json({
        message: "You have already sent connection request to this user",
      });
    }
    let newRequest = await Connection.create({
      sender,
      reciver: id,
    });

    let reciverSocketId = userShocketMap.get(id);
    let senderSocketId = userShocketMap.get(sender);

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("statusUpdate", {
        updatedUserId: sender,
        newStatus: "recived",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: id,
        newStatus: "pending",
      });
    }

    return res.status(200).json(newRequest);
  } catch (error) {
    return res.status(500), json({ message: `sendconnection error ${error}` });
  }
};
export const acceptConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    if (connection.status != "pending") {
      return res
        .status(400)
        .json({ message: "Connection request is under processing" });
    }

    connection.status = "accepted";
    await connection.save();
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender._id },
    });
    await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.userId },
    });

    let reciverSocketId = userShocketMap.get(connection.reciver._id.toString());
    let senderSocketId = userShocketMap.get(connection.sender._id.toString());

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender._id,
        newStatus: "disconnect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId,
        newStatus: "disconnect",
      });
    }

    return res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `acceptConnection error ${error}` });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection donts exist" });
    }
    if (connection.status != "pending") {
      return res
        .status(400)
        .json({ message: "Connection request is under processing" });
    }

    connection.status = "rejected";
    await connection.save();

    return res
      .status(200)
      .json({ message: "Connection request rejected successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `rejectedConnection error ${error}` });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    let currentUser = await User.findById(currentUserId);
    if (currentUser.connection.includes(targetUserId)) {
      return res.json({ status: "disconnect" });
    }
    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currentUserId, reciver: targetUserId },
        { sender: targetUserId, reciver: currentUserId },
      ],
      status: "pending",
    });
    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "recived", requestId: pendingRequest._id });
      }
    }
    return res.json({ status: "connect" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getConnectionRequests error ${error}` });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const otherUserId = req.params.userId;

    await User.findByIdAndUpdate(myId, { $pull: { connection: myId } });
    await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

    let reciverSocketId = userShocketMap.get(otherUserId);
    let senderSocketId = userShocketMap.get(myId);

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("statusUpdate", {
        updatedUserId: myId,
        newStatus: "connect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: otherUserId,
        newStatus: "connect",
      });
    }

    return res.json({ message: "Connection removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: `removeConnection error ${error}` });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Connection.find({
      reciver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline"
    );
    return res.status(200).json(requests);
  } catch (error) {
    console.error(`getConnectionRequests error: ${error}`);
    return res
      .status(500)
      .json({ message: `getConnectionRequests error ${error}` });
  }
};

export const getUserconnections = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      "connection",
      "firstName lastName userName profieImage headline connection"
    );
    return res.status(200).json(user.connection);
  } catch (error) {
    console.error(`getUserconnections error: ${error}`);
    return res
      .status(500)
      .json({ message: `getUserconnections error ${error}` });
  }
};
