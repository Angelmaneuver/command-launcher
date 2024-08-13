interface AbstractState {
  guideGroupId?: string;
  itemId?: string;
  mainTitle: string;
  title: string;
  step?: number;
  totalSteps?: number;
  initialValue?: unknown;
  validate?: (value: string) => Promise<string | undefined>;
  shouldResume?: () => Promise<boolean>;
  resultSet: Record<string, unknown>;
  back?: boolean;
}

interface Guide {
  key: string;
  state?: Partial<AbstractState>;
  args?: Array<unknown>;
}

export type { AbstractState, Guide };
