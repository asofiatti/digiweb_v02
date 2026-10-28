import { NextResponse } from 'next/server';

// Importe o seu cliente do Supabase
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { usuario, senha } = await request.json();

    if (!usuario || !senha) {
      return NextResponse.json(
        { error: 'Informe o usuário e a senha.' },
        { status: 400 }
      );
    }

    // Consulta na tabela usuario do nosso banco PostgreSQL
    const sql = 'SELECT * FROM usuario WHERE usuario = $1 AND senha = $2';
    const result = await query(sql, [usuario, senha]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id_usuario,
        nome: user.nome,
        usuario: user.usuario,
        id_status: user.id_status, 
        id_tipo_usuario: user.id_tipo_usuario,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}