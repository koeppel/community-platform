import { useState } from 'react'
import { Form } from 'react-final-form'
import { ARRAY_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { Button, Loader } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { isModuleSupported, MODULE } from 'src/modules'
import { Flex } from 'theme-ui'
import { v4 as uuid } from 'uuid'

import { CollectionSection } from './content/sections/Collection.section'
import { ExpertiseSection } from './content/sections/Expertise.section'
import { FocusSection } from './content/sections/Focus.section'
import { PublicContactSection } from './content/sections/PublicContact.section'
import { UserImagesSection } from './content/sections/UserImages.section'
import { UserInfosSection } from './content/sections/UserInfos.section'
import { WorkspaceSection } from './content/sections/Workspace.section'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from './constants'
import { buttons } from './labels'

import type { IUser } from 'src/models'
import type { IFormNotification } from './content/SettingsFormNotifications'

export const SettingsPageUserProfile = () => {
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { userStore } = useCommonStores().stores
  const user = userStore.activeUser

  const saveProfile = async (values: IUser) => {
    if (!user) return
    setIsLoading(true)

    const toUpdate = {
      _id: user?._id,
      ...values,
    }

    toUpdate.coverImages = (toUpdate.coverImages as any[]).filter((cover) =>
      cover ? true : false,
    )

    try {
      logger.debug({ profile: toUpdate }, 'SettingsPage.saveProfile')
      await userStore.updateUserProfile(toUpdate, 'settings-save-profile')

      setNotification({
        message: 'Profile Saved',
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      logger.warn(
        { error, profile: toUpdate },
        'SettingsPage.saveProfile.error',
      )
      setNotification({
        message: `Save Failed - ${error}`,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  const validateForm = (v: IUser) => {
    const errors: any = {}
    // must have at least 1 cover (awkard react final form array format)
    if (!v.coverImages[0] && v.profileType !== ProfileTypeList.MEMBER) {
      errors.coverImages = []
      errors.coverImages[ARRAY_ERROR] = 'Must have at least one cover image'
    }
    if (!v.links[0]) {
      errors.links = []
      errors.links[ARRAY_ERROR] = 'Must have at least one valid link'
    }
    return errors
  }

  const coverImages = new Array(4)
    .fill(null)
    .map((v, i) => (user?.coverImages[i] ? user?.coverImages[i] : v))

  const links = (
    user && user?.links?.length > 0 ? user.links : [{} as any]
  ).map((i) => ({
    ...i,
    key: uuid(),
  }))

  const initialValues = {
    profileType: user?.profileType || ProfileTypeList.MEMBER,
    displayName: user?.displayName || null,
    userName: user?.userName,
    links,
    location: user?.location || null,
    about: user?.about || null,
    openingHours: user?.openingHours || [{}],
    workspaceType: user?.workspaceType || null,
    collectedPlasticTypes: user?.collectedPlasticTypes || null,
    machineBuilderXp: user?.machineBuilderXp || null,
    isContactableByPublic:
      user?.isContactableByPublic || DEFAULT_PUBLIC_CONTACT_PREFERENCE,
    userImage: user?.userImage || null,
    coverImages,
  }

  const formId = 'userProfileForm'

  if (!user) return null

  return (
    <Form
      id={formId}
      onSubmit={async (values) => await saveProfile(values)}
      initialValues={initialValues}
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      validateOnBlur
      render={({
        dirty,
        submitFailed,
        submitting,
        submitSucceeded,
        values,
        handleSubmit,
        invalid,
        errors,
      }) => {
        if (isLoading) return <Loader sx={{ alignSelf: 'center' }} />

        const isMember = values.profileType === ProfileTypeList.MEMBER

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />

            <form id={formId} onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: [4, 6] }}>
                {isModuleSupported(MODULE.MAP) && <FocusSection />}

                {values.profileType === ProfileTypeList.WORKSPACE && (
                  <WorkspaceSection />
                )}

                {values.profileType === ProfileTypeList.COLLECTION_POINT && (
                  <CollectionSection
                    required={
                      values.collectedPlasticTypes
                        ? values.collectedPlasticTypes.length === 0
                        : true
                    }
                    formValues={values}
                  />
                )}

                {values.profileType === ProfileTypeList.MACHINE_BUILDER && (
                  <ExpertiseSection
                    required={
                      values.machineBuilderXp
                        ? values.machineBuilderXp.length === 0
                        : true
                    }
                  />
                )}

                <UserInfosSection formValues={values} />

                <UserImagesSection isMemberProfile={isMember} values={values} />

                {!isMember && (
                  <PublicContactSection
                    isContactableByPublic={values.isContactableByPublic}
                  />
                )}
              </Flex>
            </form>

            <Button
              large
              form={formId}
              data-cy="save"
              title={
                invalid ? `Errors: ${Object.keys(errors || {})}` : 'Submit'
              }
              onClick={() => window.scrollTo(0, 0)}
              variant={'primary'}
              type="submit"
              disabled={submitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              {buttons.save}
            </Button>
          </Flex>
        )
      }}
    />
  )
}