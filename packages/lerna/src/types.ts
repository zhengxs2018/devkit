/** RawManifest The subset of package.json properties that Lerna uses */
export type RawManifest = {
  name: string
  private: boolean
  version: string
  bin: string | Record<string, string>
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  optionalDependencies: Record<string, string>
  peerDependencies: Record<string, string>
  publishConfig: Record<'directory' | 'registry' | 'tag', string>
  workspaces: string[] | { packages: string[] }
  [_: string]: unknown
}

export type LernaPackage = {
  // accessors
  version: string
  contents: string
  bin: RawManifest['bin']

  // readonly getters
  readonly resolved: string
  readonly location: string
  readonly rootPath: string
  readonly binLocation: string
  readonly manifestLocation: string
  readonly nodeModulesLocation: string

  readonly private: RawManifest['private']
  readonly scripts: RawManifest['scripts']
  readonly dependencies: RawManifest['dependencies']
  readonly devDependencies: RawManifest['devDependencies']
  readonly optionalDependencies: RawManifest['optionalDependencies']
  readonly peerDependencies: RawManifest['peerDependencies']

  /**
   * Map-like retrieval of arbitrary values
   *
   * @param field - name to retrieve value
   * @returns value stored under key, if present
   */
  get<
    K extends string,
    V = K extends keyof RawManifest ? RawManifest[K] : unknown
  >(
    key: K
  ): V

  /**
   * Map-like storage of arbitrary values
   *
   * @param key - field name to store value
   * @param val - value to store
   * @returns instance for chaining
   */
  set<K extends keyof RawManifest>(
    key: K,
    val: RawManifest[K]
  ): Promise<LernaPackage>

  /**
   * Provide shallow copy for munging elsewhere
   */
  toJSON(): Record<string, unknown>

  /**
   * Refresh internal state from disk (e.g., changed by external lifecycles)
   */
  refresh(): Promise<LernaPackage>

  /**
   * Write manifest changes to disk
   * @returns resolves when write finished
   */
  serialize(): Promise<LernaPackage>

  /**
   * Mutate local dependency spec according to type
   * @param resolved -  npa metadata
   * @param depVersion -  semver
   * @param savePrefix - npm_config_save_prefix
   */
  updateLocalDependency(
    resolved: Record<string, unknown>,
    depVersion: string,
    savePrefix: string
  ): void
}

export type PackageFilter = {
  /** 指定包含的包 */
  include?: string | string[]
  /** 指定排除的包 */
  exclude?: string | string[]
  /**
   * 跳过私有的包
   * */
  skipPrivate?: boolean
  /**
   * 如果没有匹配到任何包不做任何处理
   * */
  continueIfNoMatch?: boolean
}
