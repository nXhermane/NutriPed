import { PatientCareSessionAppService, PatientCareSessionServiceUseCases } from "@/core/nutrition_care/application/services/PatientCareSessionService";
import { CreatePatientCareSessionRequest, GetPatientCareSessionRequest, AddDataToPatientCareSessionRequest, EvaluatePatientAppetiteRequest, OrientPatientRequest, MakePatientCareSessionReadyRequest, GetDailyJournalRequest } from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<PatientCareSessionServiceUseCases> = {
    createUC: { execute: jest.fn() },
    getUC: { execute: jest.fn() },
    addDataUC: { execute: jest.fn() },
    evaluatePatientAppetiteUC: { execute: jest.fn() },
    orientPatientUC: { execute: jest.fn() },
    makeCareSessionReadyUC: { execute: jest.fn() },
    getDailyJournalsUC: { execute: jest.fn() },
};

describe("PatientCareSessionAppService", () => {
    const service = new PatientCareSessionAppService(mockUseCases);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should return the id on successful creation", async () => {
            const request: CreatePatientCareSessionRequest = { patientId: "patient-id" };
            const response = { id: "test-id" };
            mockUseCases.createUC.execute.mockResolvedValue(right(Result.ok(response)));
            const result = await service.create(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.createUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: CreatePatientCareSessionRequest = { patientId: "patient-id" };
            const error = { err: "Creation failed" };
            mockUseCases.createUC.execute.mockResolvedValue(left(error));
            const result = await service.create(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.createUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("get", () => {
        it("should return the patient care session on successful retrieval", async () => {
            const request: GetPatientCareSessionRequest = { patientId: "patient-id" };
            const response = { id: "test-id" };
            mockUseCases.getUC.execute.mockResolvedValue(right(Result.ok(response as any)));
            const result = await service.get(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: GetPatientCareSessionRequest = { patientId: "patient-id" };
            const error = { err: "Not found" };
            mockUseCases.getUC.execute.mockResolvedValue(left(error));
            const result = await service.get(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("addData", () => {
        it("should return void on successful data addition", async () => {
            const request: AddDataToPatientCareSessionRequest = { patientId: "patient-id", data: {} };
            mockUseCases.addDataUC.execute.mockResolvedValue(right(Result.ok(undefined)));
            const result = await service.addData(request);
            expect(result).toEqual({ data: undefined });
            expect(mockUseCases.addDataUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: AddDataToPatientCareSessionRequest = { patientId: "patient-id", data: {} };
            const error = { err: "Failed to add data" };
            mockUseCases.addDataUC.execute.mockResolvedValue(left(error));
            const result = await service.addData(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.addDataUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("evaluatePatientAppetite", () => {
        it("should return appetite test result on successful evaluation", async () => {
            const request: EvaluatePatientAppetiteRequest = { patientId: "patient-id", appetiteTestId: "test-id" };
            const response = { result: "pass" };
            mockUseCases.evaluatePatientAppetiteUC.execute.mockResolvedValue(right(Result.ok(response as any)));
            const result = await service.evaluatePatientAppetite(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.evaluatePatientAppetiteUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: EvaluatePatientAppetiteRequest = { patientId: "patient-id", appetiteTestId: "test-id" };
            const error = { err: "Evaluation failed" };
            mockUseCases.evaluatePatientAppetiteUC.execute.mockResolvedValue(left(error));
            const result = await service.evaluatePatientAppetite(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.evaluatePatientAppetiteUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("orientPatient", () => {
        it("should return orientation result on successful orientation", async () => {
            const request: OrientPatientRequest = { patientId: "patient-id" };
            const response = { orientation: "test-orientation" };
            mockUseCases.orientPatientUC.execute.mockResolvedValue(right(Result.ok(response as any)));
            const result = await service.orientPatient(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.orientPatientUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: OrientPatientRequest = { patientId: "patient-id" };
            const error = { err: "Orientation failed" };
            mockUseCases.orientPatientUC.execute.mockResolvedValue(left(error));
            const result = await service.orientPatient(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.orientPatientUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("makeCareSessionReady", () => {
        it("should return true on successful status change", async () => {
            const request: MakePatientCareSessionReadyRequest = { patientId: "patient-id" };
            const response = true;
            mockUseCases.makeCareSessionReadyUC.execute.mockResolvedValue(right(Result.ok(response)));
            const result = await service.makeCareSessionReady(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.makeCareSessionReadyUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: MakePatientCareSessionReadyRequest = { patientId: "patient-id" };
            const error = { err: "Failed to change status" };
            mockUseCases.makeCareSessionReadyUC.execute.mockResolvedValue(left(error));
            const result = await service.makeCareSessionReady(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.makeCareSessionReadyUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("getDailyJournals", () => {
        it("should return daily journals on successful retrieval", async () => {
            const request: GetDailyJournalRequest = { patientId: "patient-id" };
            const response = { previeous: [] };
            mockUseCases.getDailyJournalsUC.execute.mockResolvedValue(right(Result.ok(response as any)));
            const result = await service.getDailyJournals(request);
            expect(result).toEqual({ data: response });
            expect(mockUseCases.getDailyJournalsUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            const request: GetDailyJournalRequest = { patientId: "patient-id" };
            const error = { err: "Not found" };
            mockUseCases.getDailyJournalsUC.execute.mockResolvedValue(left(error));
            const result = await service.getDailyJournals(request);
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.getDailyJournalsUC.execute).toHaveBeenCalledWith(request);
        });
    });
});
