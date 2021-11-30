export const state = () => ({
  canUndo: false,
  canRedo: false,
});

export const getters = () => ({
  //   canUndo: (state: any) => {
  //     return state.canUndo;
  //   },
});

export const mutations = {
  setUndo(state: any, value: boolean) {
    state.canUndo = value;
  },
  setRedo(state: any, value: boolean) {
    state.canRedo = value;
  },
};
