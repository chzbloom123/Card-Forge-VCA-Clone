import { z } from "zod";

export const AttackDataSchema = z.object({
  emojis: z.array(z.string()),
  name: z.string(),
  toHit: z.string(),
  damage: z.string(),
  riders: z.string(),
});

export const CardDataSchema = z.object({
  entityName: z.string(),
  cardClass: z.enum(["Character", "Monster", "Mutant"]),
  tagline: z.string(),
  level: z.number(),
  cardNumber: z.string(),
  portrait: z.string(),
  hpMax: z.number(),
  hpCurrent: z.number(),
  def: z.number(),
  attacks: z.array(AttackDataSchema),
  adaptability: z.number(),
  strength: z.number(),
  perception: z.number(),
  intellect: z.number(),
  constitution: z.number(),
  ego: z.number(),
  movement: z.string(),
  fortitudeSave: z.string(),
  reflexSave: z.string(),
  willSave: z.string(),
  resistances: z.string(),
  immunities: z.string(),
  anomalyManifestations: z.string(),
  specialTraits: z.string(),
  originFile: z.string(),
});

export const CreateCardSchema = z.object({
  data: CardDataSchema,
});

export const UpdateCardSchema = z.object({
  data: CardDataSchema,
});

export type CardData = z.infer<typeof CardDataSchema>;

export const CardResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  cardClass: z.string(),
  data: CardDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CardResponse = z.infer<typeof CardResponseSchema>;
