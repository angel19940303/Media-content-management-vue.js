import { VideoEntryDataPayload } from "./video-entry-data-payload";

export class VideoEntryDataPayloadBuilder {
  private id: string;
  private url: string;
  private type: number;
  private date: string;

  private constructor() {
    this.id = "";
    this.url = "";
    this.type = 0;
    this.date = "";
  }

  static create(): VideoEntryDataPayloadBuilder {
    return new VideoEntryDataPayloadBuilder();
  }

  static fromPayload(
    payload: VideoEntryDataPayload
  ): VideoEntryDataPayloadBuilder {
    const builder = this.create();
    if (payload.id !== undefined) {
      builder.setId(payload.id);
    }
    if (payload.url !== undefined) {
      builder.setUrl(payload.url);
    }
    if (payload.type !== undefined) {
      builder.type = payload.type;
    }
    if (payload.date !== undefined) {
      builder.date = payload.date;
    }
    return builder;
  }

  setId(id: string): VideoEntryDataPayloadBuilder {
    this.id = id;
    return this;
  }

  setUrl(url: string): VideoEntryDataPayloadBuilder {
    this.url = url;
    return this;
  }

  setType(type: number): VideoEntryDataPayloadBuilder {
    this.type = type;
    return this;
  }

  setDate(date: string): VideoEntryDataPayloadBuilder {
    this.date = date;
    return this;
  }

  build(): VideoEntryDataPayload {
    return {
      id: this.id,
      url: this.url,
      type: this.type,
      date: this.date,
    };
  }
}
