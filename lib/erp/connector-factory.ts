
import { ERPType } from '@prisma/client'
import { ERPConnector } from './types'
import { TOTVSProtheusConnector } from './connectors/totvs-protheus'
import { TOTVSRMConnector } from './connectors/totvs-rm'
import { TOTVSDatasulConnector } from './connectors/totvs-datasul'
import { SAPSuccessFactorsConnector } from './connectors/sap-successfactors'
import { OracleFusionConnector } from './connectors/oracle-fusion'
import { OraclePeopleSoftConnector } from './connectors/oracle-peoplesoft'
import { ADPGlobalViewConnector } from './connectors/adp-globalview'
import { ADPVantageConnector } from './connectors/adp-vantage'
import { SeniorHCMConnector } from './connectors/senior-hcm'
import { LGLugarDeGenteConnector } from './connectors/lg-lugar-de-gente'
import { SolidesGestaoConnector } from './connectors/solides-gestao'
import { SolidesRHConnector } from './connectors/solides-rh'
import { BennerConnector } from './connectors/benner'
import { GenericERPConnector } from './connectors/generic'

export class ERPConnectorFactory {
  private static connectors: Map<ERPType, () => ERPConnector> = new Map([
    [ERPType.TOTVS_PROTHEUS, () => new TOTVSProtheusConnector()],
    [ERPType.TOTVS_RM, () => new TOTVSRMConnector()],
    [ERPType.TOTVS_DATASUL, () => new TOTVSDatasulConnector()],
    [ERPType.SAP_SUCCESSFACTORS, () => new SAPSuccessFactorsConnector()],
    [ERPType.ORACLE_FUSION_HCM, () => new OracleFusionConnector()],
    [ERPType.ORACLE_PEOPLESOFT, () => new OraclePeopleSoftConnector()],
    [ERPType.ADP_GLOBALVIEW, () => new ADPGlobalViewConnector()],
    [ERPType.ADP_VANTAGE_HCM, () => new ADPVantageConnector()],
    [ERPType.SENIOR_HCM, () => new SeniorHCMConnector()],
    [ERPType.LG_LUGAR_DE_GENTE, () => new LGLugarDeGenteConnector()],
    [ERPType.SOLIDES_GESTAO, () => new SolidesGestaoConnector()],
    [ERPType.SOLIDES_RH, () => new SolidesRHConnector()],
    [ERPType.BENNER, () => new BennerConnector()],
    [ERPType.OTHER, () => new GenericERPConnector()]
  ])

  static createConnector(erpType: ERPType): ERPConnector {
    const connectorFactory = this.connectors.get(erpType)
    
    if (!connectorFactory) {
      throw new Error(`Unsupported ERP type: ${erpType}`)
    }

    return connectorFactory()
  }

  static getSupportedERPs(): ERPType[] {
    return Array.from(this.connectors.keys())
  }

  static getERPInfo(erpType: ERPType): {
    name: string
    description: string
    authType: 'API_KEY' | 'OAUTH' | 'BASIC_AUTH' | 'CUSTOM'
    capabilities: string[]
  } {
    const connector = this.createConnector(erpType)
    
    const erpInfoMap: Record<ERPType, { name: string; description: string; authType: any }> = {
      [ERPType.TOTVS_PROTHEUS]: {
        name: 'TOTVS Protheus',
        description: 'Sistema ERP TOTVS Protheus para gestão empresarial',
        authType: 'API_KEY'
      },
      [ERPType.TOTVS_RM]: {
        name: 'TOTVS RM',
        description: 'Sistema TOTVS RM para gestão de recursos humanos',
        authType: 'API_KEY'
      },
      [ERPType.TOTVS_DATASUL]: {
        name: 'TOTVS Datasul',
        description: 'Sistema ERP TOTVS Datasul',
        authType: 'API_KEY'
      },
      [ERPType.SAP_SUCCESSFACTORS]: {
        name: 'SAP SuccessFactors',
        description: 'Plataforma SAP SuccessFactors para HCM',
        authType: 'OAUTH'
      },
      [ERPType.ORACLE_FUSION_HCM]: {
        name: 'Oracle Fusion HCM',
        description: 'Oracle Fusion Human Capital Management',
        authType: 'OAUTH'
      },
      [ERPType.ORACLE_PEOPLESOFT]: {
        name: 'Oracle PeopleSoft',
        description: 'Sistema Oracle PeopleSoft HCM',
        authType: 'BASIC_AUTH'
      },
      [ERPType.ADP_GLOBALVIEW]: {
        name: 'ADP GlobalView',
        description: 'Sistema ADP GlobalView para gestão de RH',
        authType: 'OAUTH'
      },
      [ERPType.ADP_VANTAGE_HCM]: {
        name: 'ADP Vantage HCM',
        description: 'Plataforma ADP Vantage HCM',
        authType: 'OAUTH'
      },
      [ERPType.SENIOR_HCM]: {
        name: 'Senior HCM',
        description: 'Sistema Senior para gestão de recursos humanos',
        authType: 'API_KEY'
      },
      [ERPType.LG_LUGAR_DE_GENTE]: {
        name: 'LG Lugar de Gente',
        description: 'Plataforma LG para gestão de pessoas',
        authType: 'API_KEY'
      },
      [ERPType.SOLIDES_GESTAO]: {
        name: 'Sólides Gestão',
        description: 'Sistema Sólides para gestão empresarial',
        authType: 'API_KEY'
      },
      [ERPType.SOLIDES_RH]: {
        name: 'Sólides RH',
        description: 'Sistema Sólides para recursos humanos',
        authType: 'API_KEY'
      },
      [ERPType.BENNER]: {
        name: 'Benner',
        description: 'Sistema Benner para gestão empresarial',
        authType: 'API_KEY'
      },
      [ERPType.OTHER]: {
        name: 'Genérico',
        description: 'Conector genérico para outros ERPs',
        authType: 'CUSTOM'
      }
    }

    const info = erpInfoMap[erpType]
    return {
      ...info,
      capabilities: connector.getCapabilities()
    }
  }
}
