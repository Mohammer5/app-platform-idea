import { Layer, layers, CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import AppAdapter from '@dhis2/app-adapter'
import apps from './apps.js'

const appConfig = {
    url:
        process.env.REACT_APP_DHIS2_BASE_URL ||
        window.localStorage.DHIS2_BASE_URL,
    appName: process.env.REACT_APP_DHIS2_APP_NAME || '',
    apiVersion: parseInt(process.env.REACT_APP_DHIS2_API_VERSION),
    pwaEnabled: process.env.REACT_APP_DHIS2_APP_PWA_ENABLED === 'true',
}

Shell.defaultProps = {
    withoutAdapter: true,
}

Shell.propTypes = {
    appId: PropTypes.string,
    children: PropTypes.node,
    /**
     * Some apps use the older app-platform and are built with the app shell.
     * Setting this prop to false will prevent the duplicate wrapping.
     */
    withoutAdapter: PropTypes.bool,
}

export function Shell({ appId, children, withoutAdapter }) {
    const App = apps[appId]

    if (!children && !App) {
        throw new Error(
            `No children provided and couldn't find an app with id "${appId}"`
        )
    }

    const loadingDisplay = (
        <Layer translucent level={layers.alert}>
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        </Layer>
    )

    // During development, the app is simply provided
    const app = children ? children : <App config={appConfig} />

    if (withoutAdapter) {
      return (
          <AppAdapter {...appConfig}>
              <React.Suspense fallback={loadingDisplay}>
                  {app}
              </React.Suspense>
          </AppAdapter>
      )
    }

    return (
        <React.Suspense fallback={loadingDisplay}>
            {app}
        </React.Suspense>
    )
}
