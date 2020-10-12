import { App, plainToClass } from "../../deps.ts";
import { settings } from "./setting.ts";

export function createApp() {
  const app = new App(settings);

  app.useTransform({
    type: "body",
    getTransform: (transform: unknown, body: unknown) => {
      return plainToClass(transform, body);
    },
  });

  return app;
}
