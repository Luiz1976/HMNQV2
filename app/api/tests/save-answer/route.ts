import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { testId, questionId, value, metadata } = await request.json();

    // Validar dados obrigatórios
    if (!testId || !questionId || value === undefined) {
      return NextResponse.json(
        { error: 'testId, questionId e value são obrigatórios' },
        { status: 400 }
      );
    }

    // Por enquanto, apenas simular o salvamento
    // TODO: Implementar salvamento real no banco de dados quando necessário
    console.log('Salvando resposta:', { testId, questionId, value, metadata });

    return NextResponse.json(
      { success: true, message: 'Resposta salva com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro na API save-answer:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}