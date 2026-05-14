import { log } from "../../src/utils/logger";

describe("logger", () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
  });

  afterAll(() => {
    global.console = originalConsole as any;
  });

  it("log.info should call console.log", () => {
    log.info("test info");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("INFO : test info"),
    );
  });

  it("log.error should call console.log", () => {
    log.error("test error");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("ERROR : test error"),
    );
  });

  it("log.warn should call console.log", () => {
    log.warn("test warn");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("WARN : test warn"),
    );
  });

  it("log.debug should call console.log", () => {
    log.debug("test debug");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("DEBUG : test debug"),
    );
  });
});
