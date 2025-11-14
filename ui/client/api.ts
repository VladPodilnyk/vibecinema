import { hc } from "hono/client";
import type { AppType } from "../../worker/index";

const client = hc<AppType>("/");
export default client;
