import type { Request } from 'express'

type Model = Record<string, (..._args: unknown[]) => unknown>
// type ApiFeaturesType<Type> = T
export class ApiFeatures<T extends Model> {
	constructor(readonly query: T, private readonly req: Request) {}

	/**Sort data according to req.query.sort */
	public sort(): this {
		const sortQuery = this.req.query.sort as string | undefined
		sortQuery && this.query.sort(sortQuery.split(',').join(' '))
		return this
	}

	/**Select only specific fields */
	public fields(): this {
		const fields = this.req.query.fields as string | undefined
		fields && this.query.select(fields.split(',').join(' '))
		return this
	}
	/**Paginate data using limit and skip if provided in req.query */
	public paginate(): this {
		const page = this.req.query.page ? +this.req.query.page : 1
		const limit = this.req.query.limit ? +this.req.query.limit : 10
		const skip = (page - 1) * limit
		this.query.skip(skip)
		this.query.limit(limit)
		//TODO Page not found error
		return this
	}
}
