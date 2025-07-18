import { FlowVersion } from '../../flow-version'
import { flowStructureUtil } from '../../util/flow-structure-util'
import { Migration } from '.'

export const migrateConnectionIds: Migration = {
    name: 'migrate-v1-connection-ids',
    migrate: (flowVersion: FlowVersion): FlowVersion => {
        if (flowVersion.schemaVersion === '1') {
            return {
                ...flowVersion,
                schemaVersion: '2',
                connectionIds: flowStructureUtil.extractConnectionIds(flowVersion),
            }
        }
        return flowVersion
    },
} 