import express from "express";
import { healthCheck } from "./index.controller";

export const api = express.Router();

api.get('/health', healthCheck);