interface snip {
    prefix: string | undefined;
    body: string[];
    description: string | undefined;
  }
export interface snippet {
    [key: string]: snip;
  }
  