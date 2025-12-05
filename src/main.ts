import { startServer } from "./api/server";
import { startSubscriber } from "./subscriber/start";

startSubscriber();
startServer();
