// safetyfirst/app/api/auth/register/route.js
// app/api/auth/register/route.js
"use strict";
import * as stack_auth_1 from 'path/to/stack_auth_1';
import process from 'process';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const __awaiter = (globalThis && globalThis.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) {
            if (result.done) {
                resolve(result.value);
            } else {
                adopt(result.value).then(fulfilled, rejected);
            }
        }
        generator = generator.apply(thisArg, _arguments || []);
        step(generator.next());
    });
};
const __generator = function () {
    let f;
    let y;
    let t;
    let g;
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    g.next = verb(0);
    g["throw"] = verb(1);
    g["return"] = verb(2);
    if (typeof Symbol === "function") {
        g[Symbol.iterator] = function() { return this; };
    }
    return g;
    function verb(n) { return function (v) { return step([n, v]); }; }

    function processYield(op) {
        f = 1;
        if (y) {
            t = handleYield(op);
            if (t) {
                t = t.call(y, op[1]);
                if (!t.done) return t;
            }
        }
        y = 0;
        if (t) op = [op[0] & 2, t.value];
        return op;
    }

    function handleOperation(op) {
        if (op[0]) {
            if (op[0] & 1) throw op[1];
            return { value: op[1], done: false };
        }
        return null;
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        g = g && (g = 0);
        if (op[0]) { g = 0; }

        try {
            if (f) throw new TypeError("Generator is already executing.");
            while (true) {
                try {
                    op = processYield(op);
                    const result = handleOperation(op);
                    if (result) return result;
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
                if (op[0] & 5) break;
            }
        } catch {
            if (op[0] & 5) throw op[1];
        }
        return { value: op[0] ? op[1] : void 0, done: true };
    }


    function handleYield(op) {
        if (op[0] & 2) {
            t = y["return"];
        } else if (op[0]) {
            t = y["throw"] || (t = y["return"]);
            if (t) t.call(y);
            t = 0;
        } else {
            t = y.next;
        }
        if (t) {
            t = t.call(y, op[1]);
        }
        return t && !t.done ? t : null;
    }

};
export { POST };

function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        let _a, name_1, email, password, existingUser, error_1, user, session, cookieStore, error_2;
        let _b = __generator();
        return __generator(function () {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, 10]);
                    return [4 /*yield*/, request.json()];
                    // Validate input
                case 1:
                    _a = _b.sent(); name_1 = _a.name; email = _a.email; password = _a.password;
                    // Validate input
                    if (!name_1 || !email || !password) {
                        return [2 /*return*/, NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })];
                    }
                    return [3 /*break*/, 2];
                case 2:
                    _b.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, stack_auth_1.stackServer.getUserByEmail(email)];
                case 3:
                    existingUser = _b.sent();
                    if (existingUser) {
                        return [2 /*return*/, NextResponse.json({ message: "User with this email already exists" }, { status: 409 })];
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
                    return [4 /*yield*/, cookies()];
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
                    return [2 /*return*/, NextResponse.json({
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
                    return [2 /*return*/, NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}

