export const playbackWindows=[1,3,6,12,24]as const
export function nextPlaybackWindow(current:number){return playbackWindows.find(value=>value>current)??playbackWindows[0]}
