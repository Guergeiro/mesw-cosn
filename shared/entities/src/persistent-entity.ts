export interface PersistentEntity {
  persist(
    fn: (values: Record<string, unknown>) => Promise<void>
  ): Promise<void>;
}
