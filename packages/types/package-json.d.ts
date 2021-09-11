import type { IPackageJson } from 'package-json-type'

export interface PackageJson extends IPackageJson {
  module?: string
}
