import { app } from "./index";

export default {
  async fetch(request: Request): Promise<Response> {
    return app.fetch(request);
  },
};
