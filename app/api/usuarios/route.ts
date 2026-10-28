import { NextResponse } from 'next/server';
import { query } from '@/lib/db';


// GET: Lista todos os usuários (excluindo o adm ID 1)
export async function GET() {
  try {
    const result = await query(`
      SELECT u.*, ut.descricao as tipo_descricao, us.descricao as status_descricao 
      FROM usuario u
      LEFT JOIN usuario_tipo ut ON u.id_tipo_usuario = ut.id_tipo_usuario
      LEFT JOIN usuario_status us ON u.id_status = us.id_status
      WHERE u.id_usuario <> 1
      ORDER BY u.nome
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

// POST: Cadastra um novo usuário
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, primeiro_nome, id_status, email, fone, usuario, senha, id_tipo_usuario, data_nascimento } = body;

    const sql = `
      INSERT INTO usuario (nome, primeiro_nome, id_status, email, fone, usuario, senha, id_tipo_usuario, data_nascimento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    const values = [nome, primeiro_nome, id_status, email, fone, usuario, senha, id_tipo_usuario, data_nascimento];
    const newUsuario = await query(sql, values);

    return NextResponse.json({ success: true, user: newUsuario.rows[0] });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar usuário' }, { status: 500 });
  }
}

// PUT: Atualiza um usuário existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_usuario, nome, primeiro_nome, id_status, email, fone, usuario, senha, id_tipo_usuario, data_nascimento } = body;

    if (!id_usuario || id_usuario === 1) {
      return NextResponse.json({ error: 'Usuário inválido para alteração' }, { status: 400 });
    }

    let sql = '';
    let values = [];

    if (senha && senha !== '***' && senha.trim() !== '') {
      sql = `
        UPDATE usuario 
        SET nome = $1, primeiro_nome = $2, id_status = $3, email = $4, fone = $5, usuario = $6, senha = $7, id_tipo_usuario = $8, data_nascimento = $9
        WHERE id_usuario = $10
        RETURNING *;
      `;
      values = [nome, primeiro_nome, id_status, email, fone, usuario, senha, id_tipo_usuario, data_nascimento, id_usuario];
    } else {
      sql = `
        UPDATE usuario 
        SET nome = $1, primeiro_nome = $2, id_status = $3, email = $4, fone = $5, usuario = $6, id_tipo_usuario = $7, data_nascimento = $8
        WHERE id_usuario = $9
        RETURNING *;
      `;
      values = [nome, primeiro_nome, id_status, email, fone, usuario, id_tipo_usuario, data_nascimento, id_usuario];
    }

    const updatedUsuario = await query(sql, values);
    return NextResponse.json({ success: true, user: updatedUsuario.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

// DELETE: Exclui um usuário
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || Number(id) === 1) {
      return NextResponse.json({ error: 'Não é permitido excluir este usuário' }, { status: 400 });
    }

    await query('DELETE FROM usuario WHERE id_usuario = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}