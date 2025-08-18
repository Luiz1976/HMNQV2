import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Simulação de dados de colaboradores por ERP
const MOCK_EMPLOYEES_DATA = {
  TOTVS_PROTHEUS: [
    {
      id: '001',
      email: 'joao.silva@empresa.com',
      firstName: 'João',
      lastName: 'Silva',
      cpf: '123.456.789-01',
      department: 'Tecnologia',
      position: 'Desenvolvedor Senior',
      matricula: 'TI001'
    },
    {
      id: '002',
      email: 'maria.santos@empresa.com',
      firstName: 'Maria',
      lastName: 'Santos',
      cpf: '987.654.321-02',
      department: 'Recursos Humanos',
      position: 'Analista de RH',
      matricula: 'RH002'
    },
    {
      id: '003',
      email: 'carlos.oliveira@empresa.com',
      firstName: 'Carlos',
      lastName: 'Oliveira',
      cpf: '456.789.123-03',
      department: 'Financeiro',
      position: 'Controller',
      matricula: 'FIN003'
    },
    {
      id: '004',
      email: 'ana.costa@empresa.com',
      firstName: 'Ana',
      lastName: 'Costa',
      cpf: '789.123.456-04',
      department: 'Marketing',
      position: 'Coordenadora de Marketing',
      matricula: 'MKT004'
    },
    {
      id: '005',
      email: 'pedro.almeida@empresa.com',
      firstName: 'Pedro',
      lastName: 'Almeida',
      cpf: '321.654.987-05',
      department: 'Vendas',
      position: 'Gerente de Vendas',
      matricula: 'VND005'
    }
  ],
  TOTVS_RM: [
    {
      id: '101',
      email: 'lucia.ferreira@empresa.com',
      firstName: 'Lúcia',
      lastName: 'Ferreira',
      cpf: '111.222.333-44',
      department: 'Operações',
      position: 'Supervisora de Operações',
      matricula: 'OP101'
    },
    {
      id: '102',
      email: 'roberto.lima@empresa.com',
      firstName: 'Roberto',
      lastName: 'Lima',
      cpf: '555.666.777-88',
      department: 'Qualidade',
      position: 'Analista de Qualidade',
      matricula: 'QL102'
    }
  ],
  SAP_SUCCESSFACTORS: [
    {
      id: '201',
      email: 'fernanda.rocha@empresa.com',
      firstName: 'Fernanda',
      lastName: 'Rocha',
      cpf: '999.888.777-66',
      department: 'Estratégia',
      position: 'Diretora de Estratégia',
      matricula: 'EST201'
    },
    {
      id: '202',
      email: 'gustavo.mendes@empresa.com',
      firstName: 'Gustavo',
      lastName: 'Mendes',
      cpf: '444.333.222-11',
      department: 'Inovação',
      position: 'Coordenador de Inovação',
      matricula: 'INV202'
    }
  ]
}

// Credenciais válidas para simulação
const VALID_CREDENTIALS = {
  TOTVS_PROTHEUS: { login: 'admin', password: 'admin123' },
  TOTVS_RM: { login: 'admin', password: 'admin123' },
  SAP_SUCCESSFACTORS: { login: 'admin', password: 'admin123' },
  ORACLE_HCM: { login: 'admin', password: 'admin123' },
  WORKDAY: { login: 'admin', password: 'admin123' },
  SENIOR_HCM: { login: 'admin', password: 'admin123' },
  BLING: { login: 'admin', password: 'admin123' },
  OMIE: { login: 'admin', password: 'admin123' }
}

function validateCredentials(erpType: string, login: string, password: string): boolean {
  const validCreds = VALID_CREDENTIALS[erpType as keyof typeof VALID_CREDENTIALS]
  if (!validCreds) return false

  const loginValid = validCreds.login === login
  const passwordValid = validCreds.password === password

  return loginValid && passwordValid
}

function getEmployeesForERP(erpType: string) {
  // Para ERPs que não têm dados mock específicos, usar dados do TOTVS_PROTHEUS como padrão
  const employees = MOCK_EMPLOYEES_DATA[erpType as keyof typeof MOCK_EMPLOYEES_DATA] || MOCK_EMPLOYEES_DATA.TOTVS_PROTHEUS
  
  // Adicionar variação nos dados baseada no ERP
  return employees.map(emp => ({
    ...emp,
    id: `${erpType}_${emp.id}`,
    matricula: `${erpType.substring(0, 3)}_${emp.matricula}`
  }))
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { erpType, customName, login, password, companyId } = body

    // Validação dos campos obrigatórios
    if (!erpType || !login || !password) {
      return NextResponse.json({
        success: false,
        message: 'ERP, login e senha são obrigatórios'
      }, { status: 400 })
    }

    // Simular delay de conexão
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Validar credenciais
    const isValid = validateCredentials(erpType, login, password)
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Credenciais inválidas. Verifique login e senha.'
      }, { status: 401 })
    }

    // Buscar colaboradores do ERP
    const employees = getEmployeesForERP(erpType)
    
    // Simular possível erro de importação
    if (Math.random() < 0.1) { // 10% de chance de erro
      return NextResponse.json({
        success: false,
        message: 'Erro ao importar dados do ERP. Tente novamente em alguns minutos.'
      }, { status: 500 })
    }

    // Sucesso
    return NextResponse.json({
      success: true,
      message: 'Conexão realizada com sucesso',
      erpType,
      erpName: erpType === 'OTHER' ? customName : erpType,
      employeeCount: employees.length,
      employees,
      connectionDetails: {
        connectedAt: new Date().toISOString(),
        apiVersion: '2024.1',
        departments: Array.from(new Set(employees.map(emp => emp.department).filter(Boolean))),
        lastSync: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro na auto-conexão ERP:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}