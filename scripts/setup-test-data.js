#!/usr/bin/env node

/**
 * Script para configurar dados de teste para a API ServeRest
 * Resolve o problema de erro 401 no login criando um usuário de teste
 */

const https = require('https');

// Configurações
const BASE_URL = 'https://serverest.dev';
const TEST_USER = {
    nome: 'Usuario Teste Automatizado',
    email: 'fulano@qa.com',
    password: 'teste',
    administrador: 'true'
};

/**
 * Função para fazer requisições HTTP
 */
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: JSON.parse(body)
                    };
                    resolve(response);
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

/**
 * Verifica se o usuário de teste já existe
 */
async function checkUserExists() {
    console.log('🔍 Verificando se usuário de teste existe...');
    
    try {
        const options = {
            hostname: 'serverest.dev',
            port: 443,
            path: `/usuarios?email=${TEST_USER.email}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const response = await makeRequest(options);
        
        if (response.statusCode === 200 && response.body.usuarios && response.body.usuarios.length > 0) {
            console.log('✅ Usuário de teste já existe');
            return response.body.usuarios[0];
        }
        
        console.log('❌ Usuário de teste não encontrado');
        return null;
    } catch (error) {
        console.error('❌ Erro ao verificar usuário:', error.message);
        return null;
    }
}

/**
 * Cria um novo usuário de teste
 */
async function createTestUser() {
    console.log('👤 Criando usuário de teste...');
    
    try {
        const options = {
            hostname: 'serverest.dev',
            port: 443,
            path: '/usuarios',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const response = await makeRequest(options, TEST_USER);
        
        if (response.statusCode === 201) {
            console.log('✅ Usuário criado com sucesso!');
            console.log('📧 Email:', TEST_USER.email);
            console.log('🔑 Senha:', TEST_USER.password);
            return true;
        } else {
            console.log('❌ Erro ao criar usuário:', response.body);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error.message);
        return false;
    }
}

/**
 * Testa o login com o usuário criado
 */
async function testLogin() {
    console.log('🔐 Testando login...');
    
    try {
        const loginData = {
            email: TEST_USER.email,
            password: TEST_USER.password
        };
        
        const options = {
            hostname: 'serverest.dev',
            port: 443,
            path: '/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const response = await makeRequest(options, loginData);
        
        if (response.statusCode === 200) {
            console.log('✅ Login realizado com sucesso!');
            console.log('🎫 Token:', response.body.authorization);
            return true;
        } else {
            console.log('❌ Erro no login:', response.body);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao testar login:', error.message);
        return false;
    }
}

/**
 * Atualiza o arquivo de environment com as credenciais
 */
function updateEnvironmentFile() {
    const fs = require('fs');
    const path = require('path');
    
    const environmentPath = path.join(__dirname, '..', 'postman', 'environment.json');
    
    const environment = {
        id: "test-environment",
        name: "Test Environment",
        values: [
            {
                key: "base_url",
                value: BASE_URL,
                enabled: true
            },
            {
                key: "user_email",
                value: TEST_USER.email,
                enabled: true
            },
            {
                key: "user_password",
                value: TEST_USER.password,
                enabled: true
            },
            {
                key: "auth_token",
                value: "",
                enabled: true
            }
        ]
    };
    
    try {
        fs.writeFileSync(environmentPath, JSON.stringify(environment, null, 2));
        console.log('✅ Arquivo de environment atualizado!');
        console.log('📁 Local:', environmentPath);
    } catch (error) {
        console.log('⚠️  Não foi possível atualizar o environment.json:', error.message);
        console.log('📝 Configure manualmente com as seguintes credenciais:');
        console.log('   - Email:', TEST_USER.email);
        console.log('   - Senha:', TEST_USER.password);
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('🚀 Iniciando configuração dos dados de teste...\n');
    
    // Verifica se usuário já existe
    const existingUser = await checkUserExists();
    
    if (!existingUser) {
        // Cria novo usuário
        const userCreated = await createTestUser();
        if (!userCreated) {
            console.log('\n❌ Falha ao criar usuário de teste');
            process.exit(1);
        }
    }
    
    // Testa o login
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
        console.log('\n❌ Falha no teste de login');
        process.exit(1);
    }
    
    // Atualiza arquivo de environment
    updateEnvironmentFile();
    
    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Execute os testes: npm test');
    console.log('   2. Ou use Newman: newman run postman/collection.json -e postman/environment.json');
    console.log('\n💡 Credenciais configuradas:');
    console.log('   - Email:', TEST_USER.email);
    console.log('   - Senha:', TEST_USER.password);
}

// Executa apenas se chamado diretamente
if (require.main === module) {
    main().catch(error => {
        console.error('\n💥 Erro durante a configuração:', error);
        process.exit(1);
    });
}

module.exports = {
    checkUserExists,
    createTestUser,
    testLogin,
    TEST_USER
};