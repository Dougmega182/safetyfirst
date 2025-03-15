// safetyfirst/app/api/auth/register/route.js
// app/api/auth/register/route.js
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var stack_auth_1 = require("@/lib/stack-auth");
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, email, password, existingUser, error_1, user, session, cookieStore, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 1:
                    _a = _b.sent(), name_1 = _a.name, email = _a.email, password = _a.password;
                    // Validate input
                    if (!name_1 || !email || !password) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, stack_auth_1.stackServer.getUserByEmail(email)];
                case 3:
                    existingUser = _b.sent();
                    if (existingUser) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "User with this email already exists" }, { status: 409 })];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    // If error is "user not found", continue with registration
                    // Otherwise, throw the error
                    if (error_1.code !== "user_not_found") {
                        throw error_1;
                    }
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, stack_auth_1.stackServer.createUser({
                        name: name_1,
                        email: email,
                        password: password,
                        role: "USER",
                    })
                    // Create session token
                ];
                case 6:
                    user = _b.sent();
                    return [4 /*yield*/, stack_auth_1.stackServer.createSession({
                            userId: user.id,
                            expiresIn: "7d",
                        })
                        // Set cookie with session token
                    ];
                case 7:
                    session = _b.sent();
                    return [4 /*yield*/, (0, headers_1.cookies)()];
                case 8:
                    cookieStore = _b.sent();
                    cookieStore.set("auth-session", session.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        path: "/",
                    });
                    // Return user data
                    return [2 /*return*/, server_1.NextResponse.json({
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                role: user.role || "USER",
                            },
                        })];
                case 9:
                    error_2 = _b.sent();
                    console.error("Registration error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}

