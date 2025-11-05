# 🧪 Guía Completa de Testing en NestJS

## 📋 Tabla de Contenidos

- [Introducción al Testing](#introducción-al-testing)
- [Tipos de Tests](#tipos-de-tests)
- [Configuración Inicial](#configuración-inicial)
- [Testing de Controladores](#testing-de-controladores)
- [Testing de Servicios](#testing-de-servicios)
- [Testing de Repositorios](#testing-de-repositorios)
- [Testing End-to-End (E2E)](#testing-end-to-end-e2e)
- [Mocking y Stubs](#mocking-y-stubs)
- [Comandos y Scripts](#comandos-y-scripts)
- [Mejores Prácticas](#mejores-prácticas)
- [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 Introducción al Testing

### ¿Por qué hacer Testing?

✅ **Confiabilidad:** Asegura que tu código funciona como se espera  
✅ **Prevención de Bugs:** Detecta errores antes de que lleguen a producción  
✅ **Refactoring Seguro:** Modifica código con confianza  
✅ **Documentación Viva:** Los tests documentan cómo usar tu código  
✅ **Calidad del Código:** Mejora el diseño y arquitectura

### Pirámide de Testing

```
         /\
        /  \  E2E Tests (Pocos, lentos, costosos)
       /____\
      /      \
     / Integr \  Integration Tests (Medianos)
    /__________\
   /            \
  /   Unit Tests \ Unit Tests (Muchos, rápidos, baratos)
 /________________\
```

---

## 📚 Tipos de Tests

### 1. **Unit Tests (Pruebas Unitarias)**

- Prueban funciones o métodos individuales de forma aislada
- Son rápidos y fáciles de mantener
- Usan mocks para dependencias externas

### 2. **Integration Tests (Pruebas de Integración)**

- Prueban cómo interactúan múltiples componentes
- Incluyen base de datos, APIs externas, etc.
- Más lentos pero más realistas

### 3. **E2E Tests (Pruebas End-to-End)**

- Prueban el flujo completo de la aplicación
- Simulan el comportamiento del usuario
- Los más lentos pero los más completos

---

## 🛠️ Configuración Inicial

### Dependencias Necesarias

NestJS viene con Jest preconfigurado. Verifica que tengas estas dependencias:

```bash
npm install --save-dev @nestjs/testing jest @types/jest ts-jest supertest @types/supertest
```

### Estructura de Archivos

```
src/
├── users/
│   ├── users.controller.ts
│   ├── users.controller.spec.ts    ← Test del controlador
│   ├── users.service.ts
│   ├── users.service.spec.ts       ← Test del servicio
│   ├── users.repository.ts
│   └── users.repository.spec.ts    ← Test del repositorio
├── products/
│   ├── products.controller.ts
│   ├── products.controller.spec.ts
│   ├── products.service.ts
│   └── products.service.spec.ts
test/
├── app.e2e-spec.ts                 ← Tests E2E
└── jest-e2e.json                   ← Configuración E2E
```

### Configuración de Jest

El archivo `jest.config.js` debería existir en la raíz:

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

---

## 🎮 Testing de Controladores

### Anatomía de un Test de Controlador

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

### Conceptos Clave

**`describe()`**: Agrupa tests relacionados  
**`it()` o `test()`**: Define un test individual  
**`beforeEach()`**: Se ejecuta antes de cada test  
**`afterEach()`**: Se ejecuta después de cada test  
**`beforeAll()`**: Se ejecuta una vez antes de todos los tests  
**`afterAll()`**: Se ejecuta una vez después de todos los tests

---

## 🔧 Testing de Servicios

### Ejemplo Básico

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const createUserDto = { name: 'John', email: 'john@example.com' };
    const result = await service.createUser(createUserDto);

    expect(result).toBeDefined();
    expect(result.name).toBe('John');
  });
});
```

---

## 📦 Testing de Repositorios

### Usando Mock Repository

```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};
```

---

## 🌐 Testing End-to-End (E2E)

### Configuración E2E

Archivo `test/jest-e2e.json`:

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

### Ejemplo E2E Test

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## 🎭 Mocking y Stubs

### ¿Qué es un Mock?

Un **mock** es un objeto simulado que imita el comportamiento de objetos reales de manera controlada.

### Tipos de Mocks

**1. Mock Manual:**

```typescript
const mockUserService = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: 1 }),
};
```

**2. Spy:**

```typescript
const spy = jest.spyOn(service, 'findAll');
expect(spy).toHaveBeenCalled();
```

**3. Mock de Módulos:**

```typescript
jest.mock('./users.service');
```

---

## 📝 Comandos y Scripts

### Agregar a package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:e2e:watch": "jest --config ./test/jest-e2e.json --watch"
  }
}
```

### Ejecutar Tests:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar código)
npm run test:watch

# Ejecutar tests con cobertura de código
npm run test:cov

# Ejecutar solo tests E2E
npm run test:e2e

# Ejecutar un archivo específico
npm test -- users.service.spec.ts

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="should create"
```

---

## ✅ Mejores Prácticas

### 1. Nomenclatura Clara

```typescript
// ✅ Bueno
it('should return all users when calling findAll', () => {});

// ❌ Malo
it('test1', () => {});
```

### 2. Arrange-Act-Assert (AAA Pattern)

```typescript
it('should create a user', async () => {
  // Arrange: Preparar datos y mocks
  const createUserDto = { name: 'John', email: 'john@example.com' };

  // Act: Ejecutar la función a probar
  const result = await service.createUser(createUserDto);

  // Assert: Verificar resultados
  expect(result).toBeDefined();
  expect(result.name).toBe('John');
});
```

### 3. Un Assert por Test (idealmente)

```typescript
// ✅ Bueno
it('should return user name', () => {
  expect(user.name).toBe('John');
});

it('should return user email', () => {
  expect(user.email).toBe('john@example.com');
});

// ⚠️ Aceptable (relacionados)
it('should return user with correct data', () => {
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@example.com');
});
```

### 4. Limpiar después de cada test

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### 5. Tests Independientes

Cada test debe poder ejecutarse de forma aislada sin depender de otros.

### 6. Cobertura de Código

Apunta a tener al menos 80% de cobertura:

```bash
npm run test:cov
```

---

## 📊 Matchers Comunes de Jest

```typescript
// Igualdad
expect(value).toBe(5); // Igualdad estricta (===)
expect(value).toEqual({ name: 'John' }); // Igualdad profunda

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Números
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(4.5);
expect(value).toBeCloseTo(0.3); // Para flotantes

// Strings
expect(value).toMatch(/pattern/);
expect(value).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));

// Objetos
expect(obj).toHaveProperty('name');
expect(obj).toMatchObject({ name: 'John' });

// Excepciones
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('error message');

// Funciones Mock
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenLastCalledWith(arg1, arg2);

// Promesas
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## 🎯 Cobertura de Tests

### Visualizar Cobertura

```bash
npm run test:cov
```

Esto generará un reporte en `coverage/lcov-report/index.html`

### Interpretar Cobertura

- **Statements:** % de líneas ejecutadas
- **Branches:** % de ramas condicionales (if/else) ejecutadas
- **Functions:** % de funciones ejecutadas
- **Lines:** % de líneas de código ejecutadas

### Objetivos de Cobertura

```
✅ Excelente: >80%
⚠️  Bueno: 60-80%
❌ Necesita mejora: <60%
```

---

## 🐛 Debugging de Tests

### Modo Debug

```bash
npm run test:debug
```

Luego abre Chrome y ve a `chrome://inspect`

### Console.log en Tests

```typescript
it('should debug', () => {
  console.log('Debugging value:', value);
  expect(value).toBe(5);
});
```

### Ejecutar solo un test

```typescript
// Solo este test
it.only('should run only this test', () => {});

// Saltar este test
it.skip('should skip this test', () => {});
```

---

## 📚 Recursos Adicionales

- [Documentación de Jest](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Test Básico

Crea un test para verificar que un servicio retorna datos correctos.

### Ejercicio 2: Test con Mocks

Crea un test usando mocks para simular una base de datos.

### Ejercicio 3: Test E2E

Crea un test E2E que pruebe el flujo completo de crear un usuario.

---

## 📝 Checklist de Testing

Antes de hacer deploy, verifica:

- [ ] Todos los tests pasan (`npm test`)
- [ ] Cobertura de código >80% (`npm run test:cov`)
- [ ] Tests E2E pasan (`npm run test:e2e`)
- [ ] No hay tests marcados con `.only` o `.skip`
- [ ] Todos los casos edge están cubiertos
- [ ] Tests son independientes entre sí
- [ ] Mocks están correctamente configurados
- [ ] No hay console.log en los tests finales

---

**¡Feliz Testing! 🚀**

> "Code without tests is broken by design." - Jacob Kaplan-Moss
