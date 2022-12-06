export abstract class BaseModel {
  uid?: string;

  protected constructor(model?: any) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
