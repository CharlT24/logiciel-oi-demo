declare module "ssh2-sftp-client" {
  class SftpClient {
    connect(config: any): Promise<void>;
    list(remotePath: string): Promise<any[]>;
    get(remotePath: string, localPath?: string): Promise<Buffer>;
    put(input: Buffer | string, remotePath: string): Promise<void>;
    delete(remotePath: string): Promise<void>;
    mkdir(remotePath: string, recursive?: boolean): Promise<void>;
    exists(remotePath: string): Promise<false | "d" | "l" | "-">; // ✅ ici
    end(): Promise<void>;
  }

  export = SftpClient;
}
