const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:4040'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
