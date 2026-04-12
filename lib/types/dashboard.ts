/** Corpo POST para métricas e conteúdos — alinhado ao backend ho.ko AI.nalytics em produção. */
export type MetricsPayload = {
  id_customer: string;
  startDate: string;
  endDate: string;
};

export type ContentsPostsPayload = MetricsPayload;
