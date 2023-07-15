import { HttpResponse } from "../http-response";
import { JobListItemResponse } from "./job-list-item.res";

export interface JobListResponse extends HttpResponse {
    totalRows: number;
    records: JobListItemResponse[];
}