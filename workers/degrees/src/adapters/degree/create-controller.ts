import { CreateDegree } from "@application/use-cases/create-degree/create-degree";
import { DegreeStatusEnum, EqfLevelEnum } from "@domain/enums/degree.enum";
import { Controller } from "shared-controllers";
import { z } from "zod";

const CreateDegreeInputSchema = z.object({
  facultyId: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  eqfLevel: z.nativeEnum(EqfLevelEnum),
  status: z.nativeEnum(DegreeStatusEnum),
  description: z.string().max(2000),
  goals: z.string().max(2000).optional(),
  url: z.string().url().optional(),
  abbr: z.string().optional(),
});

type CreateDegreeInputType = z.infer<typeof CreateDegreeInputSchema>;

export class CreateController implements Controller {
  readonly #useCase: CreateDegree;

  public constructor(useCase: CreateDegree) {
    this.#useCase = useCase;
  }

  public async handle(request: Request) {
    const body = await request.json<CreateDegreeInputType>();

    const degreeInput = CreateDegreeInputSchema.parse(body);

    const degree = await this.#useCase.execute(degreeInput);

    const response = new Response(JSON.stringify(degree));

    return response;
  }
}
