import "global-jsdom/register";

if (!global.navigator.platform) {
  try {
    global.navigator.platform = "MacIntel";
  } catch (error) {
    Object.defineProperty(global.navigator, "platform", {
      get() {
        return "MacIntel";
      }
    });
  }
}
