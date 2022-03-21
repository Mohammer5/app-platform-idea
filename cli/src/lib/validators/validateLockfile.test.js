const fs = require('fs')
const { reporter, prompt } = require('@dhis2/cli-helpers-engine')
const { validateLockfile } = require('./validateLockfile')

jest.mock('fs')
jest.mock('@dhis2/cli-helpers-engine')

describe('validateLockfile', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const mockYarnLock = yarnLock => {
        fs.readFileSync.mockReturnValue(yarnLock)
    }

    it('returns true if there are no duplicates', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"some-dependency":
  version "1.0.0"

"other-dependency":
  version "1.0.0"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(true)
        expect(reporter.warn).toHaveBeenCalledTimes(0)
    })

    it('returns true if duplicates are solely for non-sensitive dependencies', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"some-dependency":
  version "1.0.0"

"some-dependency":
  version "1.2.0"

"some-dependency":
  version "2.0.0"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(true)
        expect(reporter.warn).toHaveBeenCalledTimes(0)
    })

    it('detects minor version duplicates of sensitive dependencies', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@dhis2/ui@6.1.2":
  version "6.1.2"

"@dhis2/ui@6.1.3":
  version "6.1.3"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(false)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(reporter.warn).toHaveBeenLastCalledWith(
            `Found 2 versions of '@dhis2/ui' in yarn.lock: 6.1.2, 6.1.3`
        )
    })

    it('detects mjaor version duplicates of sensitive dependencies', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@dhis2/ui@7.0.0":
  version "7.0.0"

"@dhis2/ui@6.1.3":
  version "6.1.3"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(false)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(reporter.warn).toHaveBeenLastCalledWith(
            `Found 2 versions of '@dhis2/ui' in yarn.lock: 7.0.0, 6.1.3`
        )
    })

    it('only outputs warnings for sensitive dependencies', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"foo@^1.4.5":
  version "1.4.5"

"foo@1.2.3":
  version "1.2.3"
  dependencies:
    "@dhis2/ui" "^6.25.0"

"@dhis2/ui@^6.23.0":
  version "6.23.0"

"@dhis2/ui@^6.25.0":
  version "6.25.0"

"@dhis2/ui@^7.2.0":
  version "7.2.1"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(false)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(reporter.warn).toHaveBeenLastCalledWith(
            `Found 3 versions of '@dhis2/ui' in yarn.lock: 6.23.0, 6.25.0, 7.2.1`
        )
    })

    it('can fix lockfiles with duplicate minor versions', async () => {
        mockYarnLock(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@dhis2/ui@^6.0.0":
  version "6.0.0"

"@dhis2/ui@^6.2.3":
  version "6.2.3"

"@dhis2/ui@^6.1.2":
  version "6.1.2"
`)

        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: false,
            })
        ).toBe(false)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(prompt).toHaveBeenCalledTimes(0)

        reporter.warn.mockClear()
        prompt.mockResolvedValue({ fix: false })
        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: true,
            })
        ).toBe(false)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(prompt).toHaveBeenCalledTimes(1)

        reporter.warn.mockClear()
        prompt.mockClear()
        prompt.mockResolvedValue({ fix: true })
        expect(
            await validateLockfile(null, {
                paths: { yarnLock: 'yarn.lock' },
                offerFix: true,
            })
        ).toBe(true)
        expect(reporter.warn).toHaveBeenCalledTimes(1)
        expect(prompt).toHaveBeenCalledTimes(1)
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(fs.writeFileSync).toHaveBeenLastCalledWith(
            'yarn.lock',
            `# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@dhis2/ui@^6.0.0", "@dhis2/ui@^6.1.2", "@dhis2/ui@^6.2.3":
  version "6.2.3"
`
        )
    })
})
