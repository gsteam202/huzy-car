import { describe, it } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { isDefaultAdmin, DEFAULT_ADMIN_EMAILS } from "../src/lib/auth";

describe("Auth & Admin Permissions Tests", () => {
  it("recognizes didwlajfl8418@gmail.com as default admin", () => {
    assert.ok(DEFAULT_ADMIN_EMAILS.includes("didwlajfl8418@gmail.com"));

    // Case-insensitivity & whitespace trimming
    assert.equal(isDefaultAdmin("didwlajfl8418@gmail.com"), true);
    assert.equal(isDefaultAdmin("DIDWLAJFL8418@GMAIL.COM"), true);
    assert.equal(isDefaultAdmin(" didwlajfl8418@gmail.com "), true);
    assert.equal(isDefaultAdmin("DiDwLaJfL8418@gmail.com"), true);

    // Regular users
    assert.equal(isDefaultAdmin("regular.user@example.com"), false);
    assert.equal(isDefaultAdmin(null), false);
    assert.equal(isDefaultAdmin(undefined), false);
  });
});
