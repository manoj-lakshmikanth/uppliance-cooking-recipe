import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SessionState, Recipe } from '../types';

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ recipeId: string; recipe: Recipe }>) => {
      const { recipeId, recipe } = action.payload;
      
      // Only allow one active session
      if (state.activeRecipeId && state.activeRecipeId !== recipeId) {
        return; // Disallow starting new session
      }

      const totalDurationSec = recipe.steps.reduce((sum, step) => sum + step.durationMinutes * 60, 0);
      
      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: recipe.steps[0].durationMinutes * 60,
        overallRemainingSec: totalDurationSec,
        lastTickTs: Date.now(),
      };
    },
    
    pauseSession: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (session) {
        session.isRunning = false;
      }
    },
    
    resumeSession: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (session) {
        session.isRunning = true;
        session.lastTickTs = Date.now();
      }
    },
    
    tickSecond: (state, action: PayloadAction<{ recipeId: string; recipe: Recipe }>) => {
      const { recipeId, recipe } = action.payload;
      const session = state.byRecipeId[recipeId];
      
      if (!session || !session.isRunning) return;

      const now = Date.now();
      const deltaMs = session.lastTickTs ? now - session.lastTickTs : 1000;
      const deltaSec = Math.round(deltaMs / 1000);
      
      session.lastTickTs = now;
      session.stepRemainingSec = Math.max(0, session.stepRemainingSec - deltaSec);
      session.overallRemainingSec = Math.max(0, session.overallRemainingSec - deltaSec);

      // Auto-advance to next step
      if (session.stepRemainingSec === 0 && session.currentStepIndex < recipe.steps.length - 1) {
        session.currentStepIndex++;
        session.stepRemainingSec = recipe.steps[session.currentStepIndex].durationMinutes * 60;
      }

      // End session if last step completes
      if (session.stepRemainingSec === 0 && session.currentStepIndex === recipe.steps.length - 1) {
        delete state.byRecipeId[recipeId];
        state.activeRecipeId = null;
      }
    },
    
    stopCurrentStep: (state, action: PayloadAction<{ recipeId: string; recipe: Recipe }>) => {
      const { recipeId, recipe } = action.payload;
      const session = state.byRecipeId[recipeId];
      
      if (!session) return;

      // End current step immediately
      session.stepRemainingSec = 0;
      session.overallRemainingSec = Math.max(0, session.overallRemainingSec - session.stepRemainingSec);

      // If not last step, advance to next
      if (session.currentStepIndex < recipe.steps.length - 1) {
        session.currentStepIndex++;
        session.stepRemainingSec = recipe.steps[session.currentStepIndex].durationMinutes * 60;
      } else {
        // Last step - end session
        delete state.byRecipeId[recipeId];
        state.activeRecipeId = null;
      }
    },
    
    endSession: (state, action: PayloadAction<string>) => {
      delete state.byRecipeId[action.payload];
      if (state.activeRecipeId === action.payload) {
        state.activeRecipeId = null;
      }
    },
  },
});

export const { 
  startSession, 
  pauseSession, 
  resumeSession, 
  tickSecond, 
  stopCurrentStep, 
  endSession 
} = sessionSlice.actions;

export default sessionSlice.reducer;