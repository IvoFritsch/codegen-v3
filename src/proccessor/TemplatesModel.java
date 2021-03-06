/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package proccessor;

import auxiliar.ConsolePrinter;
import auxiliar.Utils;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import model.CodegenModelConfig;

/**
 *
 * @author Ivo Fritsch
 */
public class TemplatesModel {
    
    private String nome;
    private List<TemplatesField> listaCampos = new ArrayList<>();
    
    private CodegenModelConfig config;
    private TemplatesDataSupplier root;

    public String getNome() {
        return nome;
    }
    
    public List<TemplatesField> getListaCamposComAConfig(String config) {
        return listaCampos.stream().filter(c -> c.temConfig(config)).collect(Collectors.toList());
    }
    
    public List<TemplatesField> getListaCamposSemAConfig(String config) {
        return listaCampos.stream().filter(c -> !c.temConfig(config)).collect(Collectors.toList());
    }

    public List<TemplatesField> getListaCamposComAConfigIgualA(String config, String valor) {
        return listaCampos.stream().filter(c -> c.temAConfigIgualA(config, valor)).collect(Collectors.toList());
    }

    public List<TemplatesField> getListaCamposComAConfigIgualAIncluiSubconfigs(String config, String valor) {
        return listaCampos.stream().filter(c -> c.temAConfigIgualAIncluiSubconfigs(config, valor)).collect(Collectors.toList());
    }

    public List<TemplatesField> getListaCamposComAConfigDiferenteDe(String config, String valor) {
        return listaCampos.stream().filter(c -> !c.temAConfigIgualA(config, valor)).collect(Collectors.toList());
    }

    public List<String> getValoresEncontradosDaConfig(String config) {
        Set<String> retorno = new HashSet<>();
        listaCampos.stream().filter(c -> c.temConfig(config))
                .forEach(c -> {
                    if(!c.getConfig().getValorConfig(config).isEmpty()) retorno.add(c.getConfig().getValorConfig(config));
                });
        return retorno.stream().collect(Collectors.toList());
    }
    
    public List<String> getValoresESubconfigsEncontradosDaConfig(String config) {
        Set<String> retorno = new HashSet<>();
        listaCampos.stream().filter(c -> c.temConfig(config))
                .forEach(c -> {
                    if(!c.getConfig().getValorConfig(config).isEmpty()) retorno.add(c.getConfig().getValorConfig(config));
                    c.getConfig().getSubconfigsDaConfig(config).forEach(v -> retorno.add(v));
                });
        return retorno.stream().collect(Collectors.toList());
    }

    public TemplatesField getCampoComAConfig(String config) {
        TemplatesField retorno = listaCampos.stream().filter(c -> c.temConfig(config)).findFirst().orElse(null);
        if (retorno == null) {
            //ConsolePrinter.printError("Um template solicitou por algum campo com a configuração '" + config + "' definida\n"
              //      + "Mas nenhum campo foi encontrado, o template possivelmente disparará um erro a seguir");
        }
        return retorno;
    }
    
    public List<TemplatesField> getListaTodosCampos() {
        return listaCampos;
    }

    public CodegenModelConfig getConfig() {
        return config;
    }

    public TemplatesDataSupplier getRoot() {
        return root;
    }
    
    public String getNomeMin() {
        return nome.toLowerCase();
    }
    
    public String getNomePriCharMin() {
        return Utils.priCharMin(nome);
    }

    public String getPriCharNome() {
        return getNomeMin().substring(0, 1);
    }
    
    static TemplatesModel fromJson(String json){
        if(json == null) return null;
        TemplatesModel retorno = new Gson().fromJson(json, TemplatesModel.class);
        return retorno;
    }
    void preparaEstrutura(TemplatesDataSupplier root){
        this.root = root;
        if(listaCampos != null)
            listaCampos.forEach(c -> c.preparaEstrutura(this));
    }
    
}
