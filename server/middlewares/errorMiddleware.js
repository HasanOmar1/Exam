import STATUS_CODE from "../constants/statusCodes.js";

const errorHandler = async (err, req, res, next) => {
  const statusCode =
    res.statusCode === STATUS_CODE.OK
      ? STATUS_CODE.INTERNAL_SERVER_ERROR
      : res.statusCode;

  res.status(statusCode);
  res.send({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
