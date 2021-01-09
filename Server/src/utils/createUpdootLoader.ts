import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

/**
 * keys: [{ feedId: 1, userId: 2 }]
 * result: [{ feedId: 1, userId: 2, value: 1 }]
 */
export const createUpdootLoader = () =>
  new DataLoader<{ feedId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}-${updoot.feedId}`] = updoot;
      });
      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}-${key.feedId}`]
      );
    }
  );
