import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { testRouter } from "./test.router";
import { z } from "zod";
import axios from "axios";
import { sdk } from "./_core/sdk";
import { upsertUser } from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  test: testRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    adminLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const res = await axios.post("http://127.0.0.1:5000/api/admin/auth/login", {
            email: input.email,
            password: input.password,
          });
          const { user } = res.data;
          
          if (user.adminRole !== "super" && user.adminRole !== "test_admin" && user.adminRole !== "operator") {
            throw new Error("You don't have permission to access Level Test Admin");
          }

          const openId = user._id || user.id;
          await upsertUser({
            openId: openId,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Admin",
            email: user.email,
            role: "admin",
          });

          const sessionToken = await sdk.createSessionToken(openId, { name: user.firstName || "Admin" });
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
          
          return { success: true };
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || "Invalid email or password");
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
