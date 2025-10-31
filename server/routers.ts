import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createEmotionAnalysis, getUserEmotionHistory, submitEmotionFeedback, getUserFeedbackHistory, getFeedbackStats } from "./db";
import { analyzeEmotionFromAudio } from "./emotionAnalysis";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  emotion: router({
    analyze: protectedProcedure
      .input(z.object({
        audioUrl: z.string().url(),
        emotion: z.string(),
        confidence: z.number().min(0).max(100),
        emotionScores: z.string(),
        duration: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createEmotionAnalysis({
          userId: ctx.user.id,
          audioUrl: input.audioUrl,
          emotion: input.emotion,
          confidence: Math.round(input.confidence),
          emotionScores: input.emotionScores,
          duration: input.duration,
        });
        return { success: true };
      }),
    
    detectFromUrl: protectedProcedure
      .input(z.object({
        audioUrl: z.string().url(),
        duration: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await analyzeEmotionFromAudio(input.audioUrl);
        
        await createEmotionAnalysis({
          userId: ctx.user.id,
          audioUrl: input.audioUrl,
          emotion: result.emotion,
          confidence: result.confidence,
          emotionScores: JSON.stringify(result.emotionScores),
          duration: input.duration,
        });
        
        return result;
      }),
    
    history: protectedProcedure.query(async ({ ctx }) => {
      return getUserEmotionHistory(ctx.user.id);
    }),
  }),

  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        analysisId: z.number(),
        aiPredictedEmotion: z.string(),
        aiConfidence: z.number(),
        userCorrectedEmotion: z.string().optional(),
        userConfidence: z.number().optional(),
        isCorrected: z.boolean(),
        feedback: z.string().optional(),
        helpfulnessRating: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const feedbackId = await submitEmotionFeedback({
          userId: ctx.user.id,
          analysisId: input.analysisId,
          aiPredictedEmotion: input.aiPredictedEmotion,
          aiConfidence: input.aiConfidence,
          userCorrectedEmotion: input.userCorrectedEmotion || null,
          userConfidence: input.userConfidence || null,
          isCorrected: input.isCorrected,
          feedback: input.feedback || null,
          helpfulnessRating: input.helpfulnessRating || null,
        });
        return { success: true, feedbackId };
      }),
    
    getUserHistory: protectedProcedure
      .query(async ({ ctx }) => {
        return getUserFeedbackHistory(ctx.user.id);
      }),
    
    getStats: publicProcedure
      .query(async () => {
        return getFeedbackStats();
      }),
  }),
});

export type AppRouter = typeof appRouter;
