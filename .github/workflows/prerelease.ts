import path from 'node:path'
import fs from 'node:fs/promises'

function slugify(str: string) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

async function main() {
  console.log('Prepare release')

  const projectPath = process.cwd()
  const publishPath = path.join(projectPath, 'publish')

  /**
   * - GitHub default environment variables
   *   https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
   * - GitHub Action: Uploading release assets
   *   https://github.com/softprops/action-gh-release?tab=readme-ov-file#%EF%B8%8F-uploading-release-assets
   */

  const {
    GITHUB_REPOSITORY: repoFullName, // tangible/example-plugin
    GITHUB_REF_TYPE: eventType, // branch or tag
    /**
     * refs/heads/<branch_name>
     * refs/tags/<tag_name>
     * refs/pull/<pr_number>/merge
     */
    GITHUB_REF: gitRef,
    // Branch or tag name
    GITHUB_REF_NAME: gitRefName = 'unknown',
  } = process.env

  console.log('Repository', repoFullName)
  console.log('Event type', eventType)
  console.log('Git ref', gitRef)

  // Source zip file

  const config = await import('../../tangible.config.js')

  const zipFileName = `${config.archive.root}.zip`
  const sourceZipPath = path.join(publishPath, zipFileName)

  if (!(await fs.exists(sourceZipPath))) {
    console.log('Source zip file not found', sourceZipPath)
    return
  }

  console.log('Source zip file', sourceZipPath)

  const releaseTextPath = path.join(publishPath, `release.md`)

  async function writeRelease(text: string) {
    console.log('Write release text', releaseTextPath)
    console.log(text)
    await fs.writeFile(releaseTextPath, text)
  }

  if (eventType === 'tag') {
    const tag = gitRefName
    console.log('Release on tag', tag)

    /**
     * TODO: List commit messages since last version tag, or
     * get it from changelog.md
     */

    await writeRelease(`# ${tag}`)

    // `{plugin}-{version}.zip`

    const targetZipPath = sourceZipPath.replace('.zip', `-${tag}.zip`)

    console.log('Target zip file', targetZipPath)
    await fs.rename(sourceZipPath, targetZipPath)

    return
  }

  const branch = gitRefName

  if (branch === 'main' || branch === 'master') {

    console.log('Release preview on main/master branch')

    await writeRelease(`# Release preview`)

    // `{plugin}-latest.zip`

    const targetZipPath = sourceZipPath.replace('.zip', `-latest.zip`)

    console.log('Target zip file', targetZipPath)
    await fs.rename(sourceZipPath, targetZipPath)

    return
  }

  console.log('Release preview on branch', branch)

  // `{plugin}-{branch}-latest.zip`

  await writeRelease(`# Branch preview ${branch}`)

  const targetZipPath = sourceZipPath.replace('.zip', `-${
    slugify(branch)
  }-latest.zip`)

  console.log('Target zip file', targetZipPath)
  await fs.rename(sourceZipPath, targetZipPath)

}

main()
