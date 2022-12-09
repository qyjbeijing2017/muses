import preprocess from '@shaderfrog/glsl-parser/dist/preprocessor';
import { IProperty } from '../../../../properties/properties';
import { GLSLContext } from './glsl-context';

function properties2glsl(options: {
    properties: IProperty[]
    instance?: boolean;
}) {
    const stroage = options.instance ? 'attribute' : 'uniform';
    return options.properties.map((property) => {
        switch (property.type) {
            case 'Int':
                return `${stroage} highp int ${property.name};`;
            case 'Float':
                return `${stroage} highp float ${property.name};`;
            case 'Range':
                return `${stroage} highp float ${property.name};`;
            case 'Color':
                return `${stroage} lowp vec4 ${property.name};`;
            case 'Vector':
                return `${stroage} highp vec4 ${property.name};`;
            case '2D':
                return `${stroage} sampler2D ${property.name};`;
            case '3D':
                return `${stroage} sampler2D ${property.name};`;
            case 'Cube':
                return `${stroage} samplerCube ${property.name};`;
            default:
                throw new Error(`Unsupported property type ${property.type}`);
        }
    }).join('\n');
}

export function glslPreprocess(source: string, options?: {
    defines?: { [key: string]: object },
    includes?: { [key: string]: string },
    properties?: IProperty[];
    instance?: boolean;
}) {
    let output = source;
    const vertexFunctionName = source.match(/#pragma\s+vertex\s+(\w+)/)?.[1] || 'vertex';
    const fragmentFunctionName = source.match(/#pragma\s+fragment\s+(\w+)/)?.[1] || 'fragment';
    output = output.replace(/#pragma\s+vertex\s+(\w+)/, '');
    output = output.replace(/#pragma\s+fragment\s+(\w+)/, '');

    const ctx = new GLSLContext();

    // replace include
    const includeRegex = /#include\s+<(\w+)>/g;
    let match;
    while (match = includeRegex.exec(source)) {
        const includeName = match[1];
        const includeSource = options?.includes ? options?.includes[includeName] : null;
        if (includeSource) {
            output = output.replace(match[0], includeSource);
        } else {
            throw new Error(`Include ${includeName} not found`);
        }
    }
    const propertiesStr = options?.properties ? properties2glsl({
        properties: options.properties,
        instance: options.instance,
    }) : '';
    output = propertiesStr + output;
    output = preprocess(output, {
        defines: options?.defines,
    });
    return {
        code: output,
        vertexFunctionName,
        fragmentFunctionName,
        ctx,
    };
}