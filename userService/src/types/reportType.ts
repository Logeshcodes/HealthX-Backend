import { ReportInterface } from "../models/reportModel";

export interface ReportResponse {
    reports: ReportInterface[];
    totalPages: number;
  }
  